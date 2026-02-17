# MiniMCP

A tiny, declarative MCP server built with Deno and TypeScript. Define tools, resources, and prompts
in plain objects — no boilerplate.

## Quick Start

```bash
# 1. Install Deno (if needed)
curl -fsSL https://deno.land/install.sh | sh

# 2. Clone & run
git clone https://github.com/thewizster/MiniMCP.git
cd MiniMCP
deno task start
```

## What Is This?

**MCP (Model Context Protocol)** lets AI apps like Claude call your code. MiniMCP makes building an
MCP server as simple as possible:

```typescript
import { MiniMCP } from "./src/server.ts";

const mcp = new MiniMCP("my-server");

mcp.addTool({
  name: "greet",
  description: "Say hello",
  inputs: { name: { type: "string", description: "Who to greet" } },
  handler: ({ name }) => `Hello, ${name}!`,
});

mcp.start();
```

That's it. Three concepts, one API:

| Concept       | What it does              | Method          |
| ------------- | ------------------------- | --------------- |
| **Tools**     | Functions the AI can call | `addTool()`     |
| **Resources** | Data the AI can read      | `addResource()` |
| **Prompts**   | Templates the AI can use  | `addPrompt()`   |

## Project Structure

```
MiniMCP/
├── src/
│   ├── server.ts          # MiniMCP helper class (the framework)
│   ├── index.ts            # Example server using the API
│   └── server_test.ts      # Tests
├── deno.json               # Tasks and config
├── GETTING_STARTED.md       # Setup guide
└── README.md
```

## Test With Claude Desktop

Add to your Claude Desktop config
(`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "minimcp": {
      "command": "deno",
      "args": ["run", "--allow-all", "/full/path/to/MiniMCP/src/index.ts"]
    }
  }
}
```

Or use the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector deno run --allow-all src/index.ts
```

## Deno Tasks

```bash
deno task start   # Run the server
deno task dev     # Run with auto-reload
deno task lint    # Lint
deno task fmt     # Format
deno task check   # Type-check
deno task test    # Run tests
```

## Docs

- [Getting Started](GETTING_STARTED.md) — Install, run, extend
- [Advanced Guide](ADVANCED.md) — Real-world patterns
- [FAQ](FAQ.md) — Common questions
- [Contributing](CONTRIBUTING.md) — How to help

## Links

- [MCP Docs](https://modelcontextprotocol.io)
- [Deno](https://deno.land)
- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## License

MIT
