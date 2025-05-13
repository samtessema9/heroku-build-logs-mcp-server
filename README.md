# Heroku Build Logs MCP Server

## Overview

The Heroku Build Logs MCP Server is a Model Context Protocol (MCP) server that exposes a tool for retrieving the latest build logs for a specified Heroku app. This allows agents like Cursor to quickly fetch and process build logs, allowing them to diagnose why a build may have failed.

## Features
- Exposes a single tool: `get-latest-build-logs` that allows your agent to fetch the latest build logs for a given app. 

## Setup Instructions

### 1. Clone and Install Dependencies
```bash
git clone github.com/samtessema9/heroku-build-logs-mcp-server
cd heroku-build-logs-mcp-server
npm install
```

### 2. Set Required Environment Variables
You must provide a Heroku API token for the production environment:
- `HEROKU_AUTH_TOKEN_PRODUCTION` — for production apps (from https://api.heroku.com)

> **Note:** The `staging` environment is only available to internal engineers. **External users do not need to set any staging credentials or include the `environment` parameter in their requests. All your apps, including staging apps, are considered to be running in production.**

You can set this in your shell, in a `.env` file, **or directly in your Cursor MCP config** (see below):
```bash
export HEROKU_AUTH_TOKEN_PRODUCTION=your_production_token
```

### 3. Re-Build the Project (optional)

> **Note:** The project is already built. You only need to run this step if you make any modifications to the code in the `src` dir.

```bash
npm run build
```

## Integrating with Cursor MCP

Add the following entry to your `.cursor/mcp.config.json` and restart Cursor:
```json
{
  "servers": [
    {
      "name": "heroku-build-logs",
      "transport": "stdio",
      "command": "node build/index.js",
      "env": {
        "HEROKU_AUTH_TOKEN_PRODUCTION": "your_heroku_token"
      }
    }
  ]
}
```

After adding the config, **restart Cursor**. Then, verify that the server was properly added by going to:

    Cursor → Settings → Cursor Settings → MCP

You should see the "heroku-build-logs" server listed among your MCP servers.

## Integration with Other Agents or Custom Clients

While this README provides instructions for integration with Cursor, the MCP Build Logs Server is a standard MCP server and can be integrated with any agent or custom client that supports the Model Context Protocol (MCP) over stdio or other supported transports. You can use the same tool interface and parameters described above to query the server from your own applications or automation scripts.

Refer to your agent's or client's documentation for details on how to connect to external MCP servers.

## Tool Documentation

### `get-latest-build-logs`
Fetches the latest build logs for a specified Heroku app.

**Parameters:**
- `appName` (string, required): The Heroku app name (as shown in your Heroku dashboard).
- `environment` (enum, optional): `"production"` (default for external users) or `"staging"` (internal engineers only).

> **Note:** The `environment` parameter is optional. **External users do not need to include it.**

**Returns:**
- The full logs from the latest build, or an error message if no builds are found or logs are unavailable.

#### Example Natural Language Query
> "Show me the latest build logs for the app `my-cool-app` in production."

## Troubleshooting
- Ensure your Heroku API tokens are valid and have access to the specified apps.
- If you see errors about missing environment variables, double-check your setup.
- The server logs to stderr when started and on fatal errors.

## License
This project is licensed under the ISC License. 
