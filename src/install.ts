#!/usr/bin/env node
import { updateClaudeConfig } from "./update_claude_config";

updateClaudeConfig({
  name: "mobile-mcp",
  command: "npx",
  args: ["mobile-mcp"],
});
