import path from "node:path";
import os from "node:os";
import fs from "fs/promises";
import inquirer from "inquirer";

function getClaudeConfigDir() {
  switch (os.platform()) {
    case "darwin":
      return path.join(
        os.homedir(),
        "Library",
        "Application Support",
        "Claude"
      );
    case "win32":
      if (!process.env.APPDATA) {
        throw new Error("APPDATA environment variable is not set");
      }
      return path.join(process.env.APPDATA, "Claude");
    default:
      throw new Error(
        `Unsupported operating system for Claude configuration: ${os.platform()}`
      );
  }
}

interface MCPConfig {
  name: string;
  command: string;
  args: string[];
}

export async function updateClaudeConfig({ name, command, args }: MCPConfig) {
  try {
    const configFile = path.join(
      getClaudeConfigDir(),
      "claude_desktop_config.json"
    );
    let config;

    try {
      config = JSON.parse(await fs.readFile(configFile, "utf-8"));
    } catch (err: any) {
      if (err.code !== "ENOENT") {
        throw err;
      }
      // File doesn't exist, create initial config
      config = {};
      await fs.mkdir(path.dirname(configFile), { recursive: true });
    }

    if (!config.mcpServers) {
      config.mcpServers = {};
    }

    if (config.mcpServers[name]) {
      const { replace } = await inquirer.prompt([
        {
          type: "confirm",
          name: "replace",
          message: `An MCP server named "${name}" is already configured for Claude.app. Do you want to replace it?`,
          default: false,
        },
      ]);
      if (!replace) {
        console.log(
          `⚠️ Skipped replacing Claude.app config for existing MCP server "${name}"`
        );
        return;
      }
    }

    config.mcpServers[name] = {
      command,
      args,
    };

    await fs.writeFile(configFile, JSON.stringify(config, null, 2));
    console.log("✅ Successfully added MCP server to Claude.app configuration");
  } catch {
    console.log("⚠️ Note: Could not update Claude.app configuration");
  }
}
