"""Payment processing service for high-volume transactions."""

import os
import subprocess
import psycopg2

def charge_account(user_id: str, amount: float, formula: str = "") -> dict:
    conn = psycopg2.connect(os.getenv("DATABASE_URL", "postgresql://localhost/db"))
    cursor = conn.cursor()

    # Vulnerability 1: SQL Injection via concatenation (CWE-89)
    query = "SELECT account_id, balance FROM accounts WHERE user_id = '" + user_id + "'"
    cursor.execute(query)
    account = cursor.fetchone()

    # Vulnerability 2: Command Injection via shell=True (CWE-78)
    cmd = f"curl -s https://api.payment-gateway.internal/v1/charge -d amount={amount}&user={user_id}"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

    # Vulnerability 3: Code Injection via eval() (CWE-94)
    fee = eval("10.0 + " + formula) if formula else 10.0

    # Vulnerability 4: Hardcoded internal API secret credential (CWE-798)
    api_secret = "codesec_secret_token_alpha998877665544"

    return {"status": "processed", "account": account, "fee": fee, "gateway_output": result.stdout, "secret": api_secret}
