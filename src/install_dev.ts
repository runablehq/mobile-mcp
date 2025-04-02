#!/usr/bin/env node

import path from "node:path";
import { updateClaudeConfig } from "./update_claude_config";

updateClaudeConfig({
  name: "mobile-mcp-dev",
  command: "node",
  args: [path.join(__dirname, "../dist/index.js")],
});
