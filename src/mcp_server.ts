import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ADBClient } from "mobile-use";

const adb = new ADBClient();

// Create an MCP server
const server = new McpServer(
  {
    name: "Mobile MCP",
    version: "0.0.7",
  },
  {
    instructions: `Before doing anything, you need to initialize the mobile by using mobile_init. 
<important_notes>
Use mobile_dump_ui for navigating and interacting with the apps. Use mobile_screenshot as fallback to understand the context.
</important_notes>
    `,
  }
);

// Initialize ADB client
// ADB Tools
server.tool(
  "mobile_dump_ui",
  "Get a detailed hierarchy of all interactive UI elements on the current screen, including their positions, text, and attributes. Use this when you want to navigate or take actions.",
  {},
  async () => {
    const ui = await adb.dumpUI();
    return { content: [{ type: "text", text: ui }] };
  }
);

server.tool(
  "mobile_tap",
  "Simulate a tap gesture at specific x,y coordinates on the screen to interact with UI elements",
  { x: z.number(), y: z.number() },
  async ({ x, y }) => {
    await adb.tap({ x, y });
    return { content: [{ type: "text", text: `Tapped at (${x}, ${y})` }] };
  }
);

server.tool(
  "mobile_swipe",
  "Perform a swipe gesture from one coordinate to another, optionally specifying duration in milliseconds",
  {
    startX: z.number(),
    startY: z.number(),
    endX: z.number(),
    endY: z.number(),
    duration: z.number().optional(),
  },
  async ({ startX, startY, endX, endY, duration }) => {
    await adb.swipe({ x: startX, y: startY }, { x: endX, y: endY }, duration);
    return {
      content: [
        {
          type: "text",
          text: `Swiped from (${startX}, ${startY}) to (${endX}, ${endY})`,
        },
      ],
    };
  }
);

server.tool(
  "mobile_type",
  "Input text into the currently focused text field or input box",
  { text: z.string() },
  async ({ text }) => {
    await adb.type(text);
    return { content: [{ type: "text", text: `Typed: ${text}` }] };
  }
);

server.tool(
  "mobile_key_press",
  "Simulate pressing a specific key or button (e.g., 'enter', 'back', 'home')",
  { key: z.string() },
  async ({ key }) => {
    await adb.keyPress(key);
    return { content: [{ type: "text", text: `Pressed key: ${key}` }] };
  }
);

server.tool(
  "mobile_screenshot",
  "Capture the current screen state as an image, useful for visual verification or when UI hierarchy is insufficient.",
  {},
  async () => {
    const screenshot = await adb.screenshot();
    const size = await adb.screenSize();
    return {
      content: [
        {
          type: "text",
          text: `Screenshot captured at width: ${size.width}px and height: ${size.height}px`,
        },
        {
          data: screenshot.toString("base64"),
          mimeType: "image/png",
          type: "image",
        },
      ],
    };
  }
);

server.tool(
  "mobile_list_packages",
  "List all installed packages on the device, optionally filtered by a search term",
  { filter: z.string().optional() },
  async ({ filter }) => {
    const packages = await adb.listPackages(filter);
    return { content: [{ type: "text", text: JSON.stringify(packages) }] };
  }
);

server.tool(
  "mobile_open_app",
  "Open an application using its package name",
  { packageName: z.string() },
  async ({ packageName }) => {
    await adb.openApp(packageName);
    return { content: [{ type: "text", text: `Opened app: ${packageName}` }] };
  }
);

server.tool(
  "mobile_init",
  "Use this command to initalize mobile device.",
  {},
  async () => {
    try {
      await adb.init();
      return {
        content: [
          {
            type: "text",
            text: `Successfully initialized mobile devices.`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Couldn't initalize the device.\n${error.message}`,
          },
        ],
      };
    }
  }
);

export async function startMCPServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Mobile use mcp server is running.");
  } catch (error) {
    console.error("Error starting MCP server:", error);
  }
}
