"""Payment processing service for high-volume transactions."""

import os
import subprocess
import psycopg2

def charge_account(user_id: str, amount: float, formula: str = "") -> dict:
    conn = psycopg2.connect(os.getenv("DATABASE_URL", "postgresql://localhost/db"))
    cursor = conn.cursor()

    # Remediated: Parameterized query prevents SQL injection (CWE-89)
    query = "SELECT account_id, balance FROM accounts WHERE user_id = %s"
    cursor.execute(query, (user_id,))
    account = cursor.fetchone()

    # Remediated: Safe argument vector without shell=True prevents Command Injection (CWE-78)
    args = ["curl", "-s", "https://api.payment-gateway.internal/v1/charge", "-d", f"amount={amount}&user={user_id}"]
    result = subprocess.run(args, capture_output=True, text=True, check=False)

    # Remediated: Safe literal float conversion without eval() (CWE-94)
    fee = 10.0 + (float(formula) if formula.replace(".", "", 1).isdigit() else 0.0)

    # Remediated: Secrets retrieved from environment variable, no hardcoded credentials (CWE-798)
    api_secret = os.getenv("PAYMENT_GATEWAY_SECRET", "")

    return {"status": "processed", "account": account, "fee": fee, "gateway_output": result.stdout, "secret": api_secret}
