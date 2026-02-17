# FAQ

## What is MCP?

**Model Context Protocol** is an open protocol that lets AI apps (like Claude) call external tools
and read external data. MiniMCP is a minimal framework for building MCP servers.

## Why Deno?

- Built-in TypeScript — no build step
- No `node_modules` or `package.json`
- Secure by default (explicit permissions)

## The server starts but nothing happens

That's normal. The server communicates over stdio (standard input/output). You need an MCP client —
like Claude Desktop or the MCP Inspector — to interact with it.

## Can I use `console.log()` for debugging?

No. Use `console.error()` instead. `stdout` is reserved for MCP protocol messages; writing to it
breaks communication.

```typescript
// ✗ Breaks the protocol
console.log("debug");

// ✓ Works fine
console.error("debug");
```

## How do I add a new tool?

Call `mcp.addTool()` before `mcp.start()`:

```typescript
mcp.addTool({
  name: "my_tool",
  description: "Does something useful",
  inputs: {
    input: { type: "string", description: "The input" },
  },
  handler: ({ input }) => `Result: ${input}`,
});
```

See [ADVANCED.md](ADVANCED.md) for async tools, file I/O, and API calls.

## What's the difference between tools, resources, and prompts?

| Feature       | Purpose                | Example                   |
| ------------- | ---------------------- | ------------------------- |
| **Tools**     | Functions the AI calls | Calculator, API wrapper   |
| **Resources** | Data the AI reads      | Config files, status info |
| **Prompts**   | Conversation templates | Code review template      |

## Client says "Server not responding"

1. Is the server running? (`deno task start`)
2. Is the config path absolute? (not relative)
3. Check stderr output for errors
4. Try the MCP Inspector to test directly

## Is MiniMCP production-ready?

It's designed for learning and prototyping. For production, add authentication, rate limiting,
proper error handling, and scoped Deno permissions.

## Where can I get help?

- [MCP Docs](https://modelcontextprotocol.io)
- [MCP GitHub](https://github.com/modelcontextprotocol)
- Open an issue on this repo
