"""Demo service containing critical security vulnerabilities for CodeSec gate audit."""

import os
import subprocess


def execute_user_query(cursor, user_id: str):
    # CRITICAL: CWE-89 SQL Injection via String Concatenation
    query = "SELECT id, email, role FROM users WHERE id = '" + user_id + "'"
    return cursor.execute(query)


def ping_diagnostics(host: str):
    # CRITICAL: CWE-78 OS Command Injection
    cmd = "ping -c 2 " + host
    return subprocess.run(cmd, shell=True, capture_output=True)


def calculate_formula(user_expression: str):
    # CRITICAL: CWE-94 Code Injection via eval
    return eval(user_expression)


# CRITICAL: CWE-798 Hardcoded API Secret
api_secret = "sk_live_98471928374829103847291"
