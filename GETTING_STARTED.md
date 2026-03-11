# Getting Started

This guide takes you from zero to a running MCP server in under 5 minutes.

## 1. Install Deno

**macOS / Linux:**

```bash
curl -fsSL https://deno.land/install.sh | sh
```

**Windows (PowerShell):**

```powershell
irm https://deno.land/install.ps1 | iex
```

Verify: `deno --version`

## 2. Clone & Run

```bash
git clone https://github.com/thewizster/MiniMCP.git
cd MiniMCP
deno task start
```

The server will print `MiniMCP "minimcp" started` to stderr and then wait for input — that's normal.
It communicates over stdio.

## 3. Connect a Client

### Claude Desktop

Edit your config file:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

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

Replace `/full/path/to/MiniMCP` with the actual path. Restart Claude Desktop.

### MCP Inspector

```bash
npx @modelcontextprotocol/inspector deno run --allow-all src/index.ts
```

Open the URL it prints (usually `http://localhost:5173`).

## 4. How the Code Works

Open `src/index.ts` — it's about 50 lines:

```typescript
import { MiniMCP } from "./server.ts";

const mcp = new MiniMCP("minimcp");

// Define a tool — a function the AI can call
mcp.addTool({
  name: "echo",
  description: "Echoes back the input text.",
  inputs: {
    message: { type: "string", description: "The message to echo back" },
  },
  handler: ({ message }) => `Echo: ${message}`,
});

// Define a resource — data the AI can read
mcp.addResource({
  uri: "greeting://hello",
  name: "Hello Greeting",
  description: "A simple greeting message",
  handler: () => "Hello from MiniMCP!",
});

// Define a prompt — a template the AI can use
mcp.addPrompt({
  name: "greeting",
  description: "A customizable greeting prompt",
  args: [{ name: "name", description: "Name of the person to greet", required: true }],
  handler: ({ name }) => `Hello ${name ?? "friend"}! Welcome to MiniMCP.`,
});

mcp.start();
```

Every `add*` method takes a plain object. The `handler` function is where your logic goes. Return a
string (or anything JSON-serializable for tools).

## 5. Add Your Own Tool

Add this anywhere before `mcp.start()`:

```typescript
mcp.addTool({
  name: "multiply",
  description: "Multiplies two numbers.",
  inputs: {
    a: { type: "number", description: "First number" },
    b: { type: "number", description: "Second number" },
  },
  handler: ({ a, b }) => `${a} × ${b} = ${(a as number) * (b as number)}`,
});
```

Restart the server and ask Claude to use it.

## 6. Using the Hash Tool

MiniMCP includes a built-in `hash` tool that computes a SHA-256 hash of any input text. This is useful for generating checksums, verifying data integrity, or fingerprinting content.

### Code

```typescript
mcp.addTool({
  name: "hash",
  description: "Hashes the input text using SHA-256 and returns the hex digest.",
  inputs: {
    text: { type: "string", description: "The text to hash" },
  },
  handler: async ({ text }) => {
    const data = new TextEncoder().encode(text as string);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hex = [...new Uint8Array(hashBuffer)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `SHA-256: ${hex}`;
  },
});
```

### Example

**Input text:**

> MiniMCP makes it easy to build custom MCP servers with Deno. Define tools, resources, and prompts using a simple declarative API, then connect your server to any MCP-compatible client like Claude Desktop or VS Code Copilot.

**Output:**

```
SHA-256: 9395707aa156e4eb21d0905c94ee97f62a2e257e320af1df65e9f132014ac27f
```

Try it yourself — ask the AI to *"hash this text"* with any input, and the tool will return its SHA-256 digest.

## Tips

- Use `console.error()` for debug logging — `console.log()` breaks the protocol because stdout is
  reserved for MCP messages.
- Use `deno task dev` to auto-restart on file changes.
- See [ADVANCED.md](ADVANCED.md) for async tools, file I/O, API calls, and more.

## Troubleshooting

| Problem               | Fix                                                      |
| --------------------- | -------------------------------------------------------- |
| Server not responding | Check the path in your client config is absolute         |
| Permission denied     | Run with `--allow-all` or add specific `--allow-*` flags |
| Module not found      | Ensure internet access on first run for dependency fetch |
| Changes not showing   | Restart the server and the client                        |
