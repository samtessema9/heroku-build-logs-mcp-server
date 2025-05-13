import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fetchBuilds, fetchBuildLogs } from "./helper.js";
// Create server instance
const server = new McpServer({
    name: "heroku-build-logs",
    version: "1.0.0",
    capabilities: {
        resources: {},
    },
});
// Register the get-latest-build-logs tool 
server.tool("get-latest-build-logs", "Get the latest build logs for a Heroku app (staging or production)", {
    appName: z.string().describe("The Heroku app name"),
    environment: z.enum(["staging", "production"]).optional().describe("The Heroku environment: 'staging' or 'production'. Defaults to 'production' if not provided."),
}, async ({ appName, environment }) => {
    try {
        const env = (environment ?? "production");
        const builds = await fetchBuilds(appName, env);
        if (!Array.isArray(builds) || builds.length === 0) {
            return {
                content: [
                    { type: "text", text: "No builds found for this app." },
                ],
            };
        }
        const latestBuild = builds[builds.length - 1];
        if (!latestBuild.output_stream_url) {
            return {
                content: [
                    { type: "text", text: "No output_stream_url found in latest build." },
                ],
            };
        }
        const logs = await fetchBuildLogs(latestBuild.output_stream_url);
        return {
            content: [
                { type: "text", text: logs },
            ],
        };
    }
    catch (err) {
        return {
            content: [
                { type: "text", text: `Error: ${err.message}` },
            ],
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP Build Logs Server running on stdio");
}
main().catch((err) => {
    console.error("Fatal error in main():", err);
    process.exit(1);
});
