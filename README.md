# demo-private-docs

Minimal Flask demo used as a target for local end-to-end testing.

## Run locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

App runs at http://127.0.0.1:5001.

Test credentials (fictitious, local demo only):

- username: `testuser`
- password: `testpass`

## Routes

- `GET /login` — sign-in form
- `POST /login` — submits credentials, sets session cookie
- `GET /private` — private document (requires signed-in session)
- `GET /logout` — clears session
