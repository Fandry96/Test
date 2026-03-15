import pytest

import json
from unittest.mock import patch, MagicMock
from src.k3_quota_monitor import K3QuotaMonitor

# Sample PowerShell Output (JSON format as returned by the command)
MOCK_PS_OUTPUT = json.dumps(
    [
        {
            "ProcessId": 12345,
            "CommandLine": '"C:\\Program Files\\Antigravity\\language_server.exe" --port 2025 --csrf_token abc-123-xyz',
        }
    ]
)

MOCK_PS_OUTPUT_NO_MATCH = json.dumps([])


@pytest.fixture
def monitor():
    return K3QuotaMonitor()


def test_find_process_info_success(monitor):
    """Test successful discovery of the language server process."""
    with patch("subprocess.run") as mock_run:
        # Mock successful subprocess execution
        mock_result = MagicMock()
        mock_result.stdout = MOCK_PS_OUTPUT
        mock_result.returncode = 0
        mock_run.return_value = mock_result

        process_info = monitor._find_process_info()

        assert process_info is not None
        assert process_info["ProcessId"] == 12345
        assert "csrf_token" in process_info["CommandLine"]


def test_find_process_info_not_found(monitor):
    """Test behavior when no process is found."""
    with patch("subprocess.run") as mock_run:
        mock_result = MagicMock()
        mock_result.stdout = MOCK_PS_OUTPUT_NO_MATCH
        mock_result.returncode = 0
        mock_run.return_value = mock_result

        process_info = monitor._find_process_info()
        assert process_info is None


def test_extract_token_and_port(monitor):
    """Test regex extraction of token and port."""
    cmd_line = '"C:\\Path\\To\\exe" --port 9999 --csrf_token my-secret-token-123'

    monitor._extract_token_and_port(cmd_line)

    assert monitor.csrf_token == "my-secret-token-123"
    assert monitor.port == 9999


def test_extract_token_default_port(monitor):
    """Test extraction when port is missing (defaults to 2025)."""
    cmd_line = "language_server.exe --csrf_token just-a-token"

    monitor._extract_token_and_port(cmd_line)

    assert monitor.csrf_token == "just-a-token"
    assert monitor.port == 2025  # Default


def test_get_quota_success(monitor):
    """Test fetching quota with mocked API response."""
    # Setup monitor with fake token/port
    monitor.csrf_token = "valid-token"
    monitor.port = 2025

    # Mock _find_process_info to skip finding actual process, and fake the returned proc_info
    monitor._find_process_info = MagicMock(return_value={
        "ProcessId": 12345,
        "CommandLine": '"fake" --port 2025 --csrf_token valid-token'
    })

    mock_response_data = {
        "userStatus": {
            "cascadeModelConfigData": {
                "clientModelConfigs": [
                    {
                        "quotaInfo": {
                            "remainingFraction": 0.5
                        },
                        "modelOrAlias": "gemini-pro",
                        "label": "gemini-pro"
                    }
                ]
            }
        }
    }

    with patch("requests.post") as mock_post:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = mock_response_data
        mock_post.return_value = mock_response

        data = monitor.get_quota()

        assert data["available"] is True
        assert len(data["models"]) == 1
        assert data["models"][0]["name"] == "gemini-pro"
        assert data["models"][0]["remaining"] == 50
        assert data["models"][0]["status"] == "healthy"

        # Verify headers were sent
        mock_post.assert_called_with(
            "http://127.0.0.1:2025/exa.language_server_pb.LanguageServerService/GetUserStatus",
            json={
                "metadata": {
                    "ideName": "antigravity",
                    "extensionName": "antigravity",
                    "locale": "en",
                }
            },
            headers={
                "Content-Type": "application/json",
                "X-Codeium-Csrf-Token": "valid-token",
                "Connect-Protocol-Version": "1",
            },
            timeout=5,
        )
