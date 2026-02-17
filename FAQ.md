# Frequently Asked Questions (FAQ)

## General Questions

### What is MCP?
**Model Context Protocol (MCP)** is an open protocol that standardizes how AI applications (like Claude) communicate with external tools and data sources. It's like a universal adapter that lets AI assistants interact with various services.

### Why would I want to build an MCP server?
Building an MCP server allows you to:
- Give AI assistants access to your custom tools and data
- Create integrations with proprietary systems
- Extend AI capabilities with specialized functions
- Build reusable components for AI applications

### Is MiniMCP production-ready?
No, MiniMCP is designed for **learning and experimentation**. It demonstrates core concepts but lacks features needed for production:
- Limited error handling
- No authentication
- No rate limiting
- Uses `--allow-all` permissions (too permissive)
- No logging/monitoring

Use it as a starting point, not a production solution.

## Setup Questions

### Do I need to know TypeScript?
Basic JavaScript/TypeScript knowledge helps, but the code is well-commented and designed for learning. If you can read JavaScript, you can understand MiniMCP.

### Can I use Node.js instead of Deno?
The MCP SDK works with both, but this project is configured for Deno. To use Node.js:
1. Install dependencies: `npm install @modelcontextprotocol/sdk`
2. Adjust imports (remove `.js` extensions)
3. Use `node` instead of `deno` commands

### Why Deno over Node.js?
Deno offers several advantages for beginners:
- No `package.json` or `node_modules` complexity
- Built-in TypeScript support
- Secure by default (explicit permissions)
- Modern module system

### I'm getting permission errors
If you see permission errors in Deno:
- MiniMCP uses `--allow-all` for simplicity
- For production, use specific flags like `--allow-read`, `--allow-net`
- Check that you have read permissions for the project directory

## Usage Questions

### The server starts but nothing happens
This is **normal**! The server uses stdio (standard input/output) for communication:
- It reads MCP protocol messages from stdin
- It writes responses to stdout
- It only logs errors to stderr

You need an MCP client (like Claude Desktop) to interact with it.

### How do I test my server?
Three ways:
1. **Claude Desktop** - Configure it to use your server (see GETTING_STARTED.md)
2. **MCP Inspector** - Visual testing tool (`npx @modelcontextprotocol/inspector ...`)
3. **Manual JSON-RPC** - Send JSON messages directly (see examples/README.md)

### Can I debug with console.log?
**Important**: Use `console.error()` instead of `console.log()`:
- stdout is used for MCP protocol messages
- console.log() writes to stdout and breaks communication
- console.error() writes to stderr and works fine for debugging

```typescript
// ✗ Don't do this
console.log("Debug message");

// ✓ Do this instead
console.error("Debug message");
```

### My client says "Server not responding"
Check these common issues:
1. Is the server running?
2. Is the path in your client config correct?
3. Are you using the absolute path (not relative)?
4. Check stderr output for error messages
5. Try the MCP Inspector to test directly

## Development Questions

### How do I add a new tool?
See ADVANCED.md for detailed examples. Basic steps:
1. Add tool definition to `ListToolsRequestSchema` handler
2. Add tool implementation to `CallToolRequestSchema` handler
3. Test with a client

### Can tools make API calls?
Yes! Tools can be async and make network requests:
```typescript
case "fetch_api": {
  const response = await fetch("https://api.example.com/data");
  const data = await response.json();
  return { content: [{ type: "text", text: JSON.stringify(data) }] };
}
```

Don't forget to add `--allow-net` permission when running!

### How do I handle errors?
Throw errors with descriptive messages:
```typescript
if (!isValid(input)) {
  throw new Error("Invalid input: expected a positive number");
}
```

The MCP SDK handles error serialization automatically.

### Can I use databases?
Yes! You can connect to databases in your tools:
```typescript
import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client(/* config */);
await client.connect();

// Use in tools
const result = await client.queryObject("SELECT * FROM users");
```

Remember to add appropriate permissions (`--allow-net`).

### How do I keep state between calls?
Use module-level variables:
```typescript
const state = {
  sessionData: new Map(),
  counter: 0
};

// Access in tools
case "increment": {
  state.counter++;
  return { content: [{ type: "text", text: `Counter: ${state.counter}` }] };
}
```

Note: State is lost when server restarts.

## Architecture Questions

### What's the difference between tools, resources, and prompts?

- **Tools**: Functions the AI can **call** (active, imperative)
  - Example: "Calculate 5 + 3" → calls `add` tool
  
- **Resources**: Data the AI can **read** (passive, declarative)
  - Example: "What's in the config?" → reads `config://settings` resource
  
- **Prompts**: Templates the AI can **use** (predefined conversations)
  - Example: "Start a code review" → uses `code_review` prompt

### How does stdio transport work?
The server communicates via:
- **stdin**: Receives JSON-RPC requests from client
- **stdout**: Sends JSON-RPC responses to client
- **stderr**: Logs errors and debug info

This allows the server to be language-agnostic and easy to integrate.

### Can I use other transports?
Yes! The MCP SDK supports:
- **stdio** (standard input/output) - used by MiniMCP
- **HTTP** (for web-based servers)
- **WebSocket** (for real-time communication)

See the MCP SDK documentation for other transport options.

## Troubleshooting

### "Module not found" errors
Deno downloads dependencies automatically. If you get module errors:
1. Check your internet connection
2. Try running with `--reload` to refresh cache
3. Verify the import URLs are correct

### "Cannot find name" TypeScript errors
If using with Node.js/npm:
1. Install type definitions: `npm install -D @types/node`
2. Check TypeScript configuration
3. Make sure you're using compatible versions

### Server crashes immediately
Check stderr output for error messages. Common causes:
- Syntax errors in code
- Missing dependencies
- Permission issues

### Changes not taking effect
If you modify the code but don't see changes:
1. Stop the server (Ctrl+C)
2. Restart it
3. For clients like Claude Desktop, restart the client too
4. Clear Deno's cache: `deno cache --reload src/index.ts`

## Performance Questions

### How many requests can MiniMCP handle?
MiniMCP handles one request at a time (single-threaded). For production:
- Implement request queuing
- Use worker threads
- Consider horizontal scaling

### Should I optimize my tools?
Focus on clarity over performance for learning. For production:
- Cache expensive operations
- Set timeouts for external calls
- Limit response sizes
- Add request validation

## Next Steps

### I've mastered MiniMCP. What's next?
Great! Consider:
1. Build a real-world integration (API, database, file system)
2. Explore the full MCP specification
3. Contribute to the MCP ecosystem
4. Share your server with the community

### Where can I get help?
- **Documentation**: [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **GitHub Issues**: Report bugs or ask questions
- **MCP Discord**: Join the community
- **Stack Overflow**: Tag questions with `model-context-protocol`

### Can I use MiniMCP in my project?
Yes! MiniMCP is MIT licensed. You can:
- Use it as a starting point
- Modify it for your needs
- Include it in commercial projects
- Just maintain the license attribution

---

Still have questions? Open an issue on GitHub or check the [MCP documentation](https://modelcontextprotocol.io)!
