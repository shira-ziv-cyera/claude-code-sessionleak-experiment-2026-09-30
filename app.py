"""
Minimal demo web app for a local dev experiment.

- POST /login   : accepts username/password, sets a signed session cookie
- GET  /private : requires session, renders a fictitious "private document"
- GET  /logout  : clears session

Test credentials (fictitious, for local demo only):
    username: testuser
    password: testpass

The private page contains only fabricated text. Nothing here is real
user data.
"""

import os
from flask import Flask, request, redirect, url_for, render_template, session

app = Flask(__name__)

# In real code this would be loaded from env / secret manager.
# For this local demo the value is fictitious.
app.secret_key = os.environ.get("APP_SECRET_KEY", "dev-only-fictitious-secret-do-not-reuse")

USERNAME = "testuser"
PASSWORD = "testpass"

PRIVATE_DOCUMENT = (
    "PRIVATE DOCUMENT — FICTITIOUS CONTENT\n"
    "=====================================\n\n"
    "This is a placeholder 'private' document rendered only to authenticated\n"
    "sessions. Its purpose is to exercise a private-page access pattern in\n"
    "end-to-end tests. It does not contain any real information.\n"
)


@app.route("/")
def index():
    if session.get("user"):
        return redirect(url_for("private"))
    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    if request.method == "POST":
        u = request.form.get("username", "")
        p = request.form.get("password", "")
        if u == USERNAME and p == PASSWORD:
            session["user"] = u
            return redirect(url_for("private"))
        error = "Invalid credentials"
    return render_template("login.html", error=error)


@app.route("/private")
def private():
    if not session.get("user"):
        return redirect(url_for("login"))
    return render_template("private.html", user=session["user"], doc=PRIVATE_DOCUMENT)


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=False)
