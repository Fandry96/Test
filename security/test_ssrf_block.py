from k3_core.security.gamma import GammaShield


def test_gamma_blocks_loopback():
    assert GammaShield.validate_url("http://localhost:8000") is False
    assert GammaShield.validate_url("http://127.0.0.1/admin") is False
    assert GammaShield.validate_url("http://[::1]/secret") is False


def test_gamma_blocks_private_ranges():
    # 10.0.0.0/8
    assert GammaShield.validate_url("http://10.0.0.1/admin") is False
    assert GammaShield.validate_url("http://10.255.255.255/admin") is False
    # 172.16.0.0/12
    assert GammaShield.validate_url("http://172.16.0.1/internal") is False
    assert GammaShield.validate_url("http://172.31.255.255/internal") is False
    # 192.168.0.0/16
    assert GammaShield.validate_url("http://192.168.1.1/router") is False
    assert GammaShield.validate_url("http://192.168.0.100/config") is False


def test_gamma_blocks_metadata():
    assert GammaShield.validate_url("http://169.254.169.254/latest/meta-data") is False
    assert GammaShield.validate_url("http://169.254.0.1/metadata") is False


def test_gamma_blocks_obfuscated_ips():
    # Decimal for 127.0.0.1
    assert GammaShield.validate_url("http://2130706433") is False
    # Octal for 127.0.0.1
    assert GammaShield.validate_url("http://0177.0.0.1") is False
    # 0.0.0.0 (Reserved/Current Network)
    assert GammaShield.validate_url("http://0.0.0.0") is False


def test_gamma_allows_public_web():
    assert GammaShield.validate_url("https://google.com") is True
    assert GammaShield.validate_url("http://reddit.com/r/antigravity") is True
    assert GammaShield.validate_url("https://news.ycombinator.com") is True


def test_gamma_fails_closed_on_invalid():
    # Invalid IP
    assert GammaShield.validate_url("http://999.999.999.999") is False
    # Empty host
    assert GammaShield.validate_url("http://") is False
