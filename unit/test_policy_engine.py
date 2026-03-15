import pytest
from unittest.mock import patch
import time
from k3_core.lib.policy_engine import PolicyEngine, PolicyStatus


# Mock the MRL Indexer to avoid actual API calls
@pytest.fixture
def mock_indexer():
    with patch("k3_core.lib.policy_engine.MatryoshkaIndexer") as MockClass:
        mock_instance = MockClass.return_value
        yield mock_instance


def test_policy_allow_when_no_rules_violated(mock_indexer):
    """Happy Path: No blocking rules found."""
    # Setup MRL to return harmless rules (or empty)
    mock_indexer.search.return_value = []

    engine = PolicyEngine(indexer=mock_indexer)
    try:
        result = engine.check_intent(intent="scrape_page", domain="reddit.com")

        assert result.status == PolicyStatus.ALLOWED
        assert "No blocking rules" in result.reason
    finally:
        engine.shutdown()


def test_policy_block_when_rule_violated(mock_indexer):
    """Blocking Path: MRL finds a blocking rule."""
    # Setup MRL to return a high-similarity blocking rule
    mock_indexer.search.return_value = [
        {
            "snippet": "RULE: BLOCK scraping on /login endpoints due to IP Ban risk.",
            "score": 0.9,
        }
    ]

    engine = PolicyEngine(indexer=mock_indexer)
    try:
        result = engine.check_intent(intent="scrape_login", domain="reddit.com")

        assert result.status == PolicyStatus.BLOCKED
        assert "Blocking Rule Found" in result.reason
    finally:
        engine.shutdown()


def test_policy_fail_closed_on_timeout(mock_indexer):
    """Critical: 500ms Timeout enforcement."""

    # Setup MRL to sleep longer than 500ms
    def slow_search(*args, **kwargs):
        time.sleep(0.6)
        return []

    mock_indexer.search.side_effect = slow_search

    engine = PolicyEngine(indexer=mock_indexer, timeout_ms=500)

    try:
        # Measure time to ensure it returns fast enough
        # Before optimization: took > 0.6s (waited for task)
        # After optimization: should take ~0.5s (returns on timeout)
        start = time.time()
        result = engine.check_intent(intent="fast_action", domain="reddit.com")
        duration = time.time() - start
        print(f"Test duration: {duration:.4f}s")

        assert result.status == PolicyStatus.BLOCKED
        assert "Timeout" in result.reason

        # Verify it didn't block for the full task duration
        # We allow some buffer (0.05s) over the 0.5s timeout
        assert duration < 0.58, f"Timeout failed to interrupt wait! Duration: {duration:.4f}s"
    finally:
        engine.shutdown()


def test_policy_fail_closed_on_index_error(mock_indexer):
    """Critical: API/Index Failure enforcement."""
    mock_indexer.search.side_effect = Exception("API connection refused")

    engine = PolicyEngine(indexer=mock_indexer)
    try:
        result = engine.check_intent(intent="risky_action", domain="reddit.com")

        assert result.status == PolicyStatus.BLOCKED
        assert "System Error" in result.reason
    finally:
        engine.shutdown()
