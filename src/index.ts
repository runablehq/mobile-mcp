#!/usr/bin/env node
import { updateClaudeConfig } from "./update_claude_config";
import { startMCPServer } from "./mcp_server";
import path from "node:path";
import yargs from "yargs";

yargs
  .command({
    command: "install",
    describe: "Install mobile-mcp",
    handler: () => {
      updateClaudeConfig({
        name: "mobile-mcp",
        command: "npx",
        args: ["mobile-mcp"],
      });
    },
  })
  .command({
    command: "dev",
    describe: "Install mobile-mcp in development mode",
    handler: () => {
      updateClaudeConfig({
        name: "mobile-mcp-dev",
        command: "node",
        args: [path.join(__dirname, "../dist/index.js")],
      });
    },
  })
  .command({
    command: "*",
    handler: () => {
      startMCPServer();
    },
  })
  .help().argv;
