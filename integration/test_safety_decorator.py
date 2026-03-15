import pytest
from unittest.mock import patch, MagicMock
from k3_core.lib.policy_engine import PolicyStatus, PolicyResult

# We will need to import the decorator.
# Assuming it will be in k3_core.lib.safety
# from k3_core.lib.safety import safety_latch, SafetyLockout

# For TDD, we might need to handle import error if file doesn't exist yet,
# but in `pytest` execution, it just fails, which is fine (RED state).
try:
    from k3_core.lib.safety import safety_latch, SafetyLockout
except ImportError:
    pass


@pytest.fixture
def mock_policy_engine():
    with patch("k3_core.lib.safety.get_policy_engine") as mock_get:
        mock_engine = MagicMock()
        mock_get.return_value = mock_engine
        yield mock_engine


def test_safety_latch_allowed(mock_policy_engine):
    """Test that function executes when Policy ALLOWS."""
    # Setup Policy
    mock_policy_engine.check_intent.return_value = PolicyResult(
        status=PolicyStatus.ALLOWED, reason="Safe"
    )

    @safety_latch("Testing {x}")
    def risky_action(x):
        return f"Done {x}"

    result = risky_action(x="login")

    assert result == "Done login"
    # Verify template formatting and call
    mock_policy_engine.check_intent.assert_called_with(
        intent="Testing login", domain="global", timeout_ms=None
    )  # Domain might default


def test_safety_latch_blocked(mock_policy_engine):
    """Test that function RAISES exception when Policy BLOCKS."""
    mock_policy_engine.check_intent.return_value = PolicyResult(
        status=PolicyStatus.BLOCKED, reason="Too risky"
    )

    @safety_latch("Testing {x}")
    def risky_action(x):
        return "Should not happen"

    with pytest.raises(SafetyLockout) as excinfo:
        risky_action(x="exploit")

    assert "Too risky" in str(excinfo.value)


def test_safety_latch_args_formatting(mock_policy_engine):
    """Test that decorator correctly formats the intent string using function args."""
    mock_policy_engine.check_intent.return_value = PolicyResult(
        status=PolicyStatus.ALLOWED, reason="Safe"
    )

    @safety_latch("Scraping {url} with {method}")
    def scrape(url, method="GET"):
        return True

    scrape("http://reddit.com", method="POST")

    mock_policy_engine.check_intent.assert_called_with(
        intent="Scraping http://reddit.com with POST", domain="global", timeout_ms=None
    )
