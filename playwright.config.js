const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://127.0.0.1:5001',
  },
  webServer: {
    command: '.venv/bin/python app.py',
    url: 'http://127.0.0.1:5001/login',
    reuseExistingServer: true,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
