<div align="center">

### Mobile MCP

A Model Context Protocol (MCP) server that provides mobile automation capabilities. This server enables LLMs to interact with mobile devices using structured UI dumps without needing to rely on screenshots or other visual inputs.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE) [![Discord](https://img.shields.io/badge/discord-purple.svg)](https://discord.runable.xyz)

</div>

## Support

Currently, only android phones are supported. iOS support will come soon.
You will need to have android sdk platform tools installed for this MCP server to work.

## Configuration

```json
{
  "mcpServers": {
    "mobile-mcp": {
      "command": "npx",
      "args": ["mobile-mcp"]
    }
  }
}
```

## VScode Installation

You can install the mobile MCP server using the VS Code CLI:

```bash
# For VS Code
code --add-mcp '{"name":"mobile","command":"npx","args":["mobile-mcp"]}'

# For VS Code Insiders
code-insiders --add-mcp '{"name":"mobile","command":"npx","args":["mobile-mcp"]}'
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).
