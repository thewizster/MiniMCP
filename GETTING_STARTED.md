# Getting Started with MiniMCP

Welcome! This guide will help you get started with MiniMCP, a minimalistic Model Context Protocol (MCP) server. This guide is designed for beginners with limited knowledge of MCP servers.

## Table of Contents
1. [What is MCP?](#what-is-mcp)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running the Server](#running-the-server)
5. [Testing the Server](#testing-the-server)
6. [Understanding the Code](#understanding-the-code)
7. [Next Steps](#next-steps)

## What is MCP?

**Model Context Protocol (MCP)** is an open protocol that allows AI applications to connect to external tools and data sources. Think of it as a bridge between AI assistants (like Claude) and the tools they can use.

An **MCP Server** provides:
- **Tools**: Functions the AI can call (like a calculator or web search)
- **Resources**: Data the AI can read (like files or databases)
- **Prompts**: Templates the AI can use for specific tasks

MiniMCP is a simple example server that demonstrates these concepts with basic implementations.

## Prerequisites

Before you begin, you'll need to install **Deno** - a modern JavaScript/TypeScript runtime.

### Installing Deno

**On macOS or Linux:**
```bash
curl -fsSL https://deno.land/install.sh | sh
```

**On Windows (PowerShell):**
```powershell
irm https://deno.land/install.ps1 | iex
```

**Verify installation:**
```bash
deno --version
```

You should see output showing the Deno version (e.g., `deno 1.40.0`).

## Installation

1. **Clone this repository** (or download it):
   ```bash
   git clone https://github.com/thewizster/MiniMCP.git
   cd MiniMCP
   ```

2. **That's it!** Deno will automatically download the necessary dependencies when you run the server.

## Running the Server

There are two ways to run the MiniMCP server:

### Option 1: Direct Run
```bash
deno run --allow-all src/index.ts
```

### Option 2: Using Deno Tasks (Recommended)
```bash
deno task start
```

When the server starts, you should see:
```
MiniMCP server started successfully
Server capabilities: tools, resources, prompts
```

**Note:** The server uses standard input/output (stdio) for communication, so it will appear to "hang" - this is normal! It's waiting for MCP protocol messages.

To stop the server, press `Ctrl+C`.

## Testing the Server

To test your MCP server, you need an MCP client. Here are the most common options:

### Option 1: Using Claude Desktop (Recommended for Beginners)

1. **Install Claude Desktop** from [claude.ai](https://claude.ai/download)

2. **Configure Claude Desktop** to use your MCP server:
   
   On macOS, edit: `~/Library/Application Support/Claude/claude_desktop_config.json`
   
   On Windows, edit: `%APPDATA%\Claude\claude_desktop_config.json`

   Add this configuration:
   ```json
   {
     "mcpServers": {
       "minimcp": {
         "command": "deno",
         "args": ["run", "--allow-all", "/FULL/PATH/TO/MiniMCP/src/index.ts"]
       }
     }
   }
   ```
   
   **Important:** Replace `/FULL/PATH/TO/MiniMCP` with the actual full path to your MiniMCP directory.

3. **Restart Claude Desktop**

4. **Test the connection** by asking Claude:
   - "What tools do you have available?" (should mention `echo` and `add`)
   - "Use the echo tool to say hello"
   - "Use the add tool to calculate 5 + 3"

### Option 2: Using the MCP Inspector (For Testing)

The MCP Inspector is a development tool for testing MCP servers:

1. **Install the MCP Inspector:**
   ```bash
   npx @modelcontextprotocol/inspector deno run --allow-all src/index.ts
   ```

2. **Open your browser** to the URL shown (usually http://localhost:5173)

3. **Test the server features:**
   - View available tools, resources, and prompts
   - Call tools with different inputs
   - Read resources
   - Get prompts

## Understanding the Code

Let's break down what MiniMCP does:

### Server Structure (`src/index.ts`)

```typescript
// 1. Initialize the server
const server = new Server(
  { name: "minimcp", version: "1.0.0" },
  { capabilities: { tools: {}, resources: {}, prompts: {} } }
);
```

### Tools (Functions)

MiniMCP provides two example tools:

1. **echo** - Returns the message you send it
   ```typescript
   // Client calls: echo("Hello!")
   // Server returns: "Echo: Hello!"
   ```

2. **add** - Adds two numbers
   ```typescript
   // Client calls: add(5, 3)
   // Server returns: "The sum of 5 and 3 is 8"
   ```

### Resources (Data)

MiniMCP provides one example resource:

- **greeting://hello** - A simple greeting message
  ```typescript
  // Client reads: greeting://hello
  // Server returns: "Hello from MiniMCP! This is a simple resource example."
  ```

### Prompts (Templates)

MiniMCP provides one example prompt:

- **greeting** - A customizable greeting prompt
  ```typescript
  // Client gets: greeting(name="Alice")
  // Server returns: "Hello Alice! Welcome to MiniMCP. How can I assist you today?"
  ```

### Communication

The server uses **stdio transport** (standard input/output), which means:
- It reads MCP protocol messages from stdin
- It writes responses to stdout
- It logs errors to stderr

This is why the server appears to "hang" - it's waiting for input!

## Next Steps

Now that you have MiniMCP running, here are some ideas to explore:

### 1. Add Your Own Tool

Add a new tool to `src/index.ts`. For example, a multiplication tool:

```typescript
// In ListToolsRequestSchema handler, add:
{
  name: "multiply",
  description: "Multiplies two numbers together",
  inputSchema: {
    type: "object",
    properties: {
      a: { type: "number", description: "First number" },
      b: { type: "number", description: "Second number" }
    },
    required: ["a", "b"]
  }
}

// In CallToolRequestSchema handler, add a case:
case "multiply": {
  const a = args.a as number;
  const b = args.b as number;
  return {
    content: [{ type: "text", text: `${a} × ${b} = ${a * b}` }]
  };
}
```

### 2. Add Your Own Resource

Create a resource that reads from a file or provides custom data.

### 3. Explore the MCP Specification

Learn more about MCP at [modelcontextprotocol.io](https://modelcontextprotocol.io)

### 4. Build Something Useful

Ideas for practical MCP servers:
- File system operations
- API integrations (weather, news, etc.)
- Database queries
- System information tools

## Troubleshooting

### "Server not responding"
- Make sure Deno is installed: `deno --version`
- Check that the path in your client config is correct
- Look at the server logs (stderr) for error messages

### "Permission denied" errors
- MiniMCP uses `--allow-all` for simplicity
- In production, you should use specific permissions like `--allow-read`, `--allow-net`, etc.

### "Module not found" errors
- Deno automatically downloads dependencies
- Make sure you have an internet connection on first run
- Try running with `--reload` flag to refresh dependencies

## Getting Help

- **MCP Documentation**: https://modelcontextprotocol.io
- **Deno Documentation**: https://deno.land/manual
- **MCP GitHub**: https://github.com/modelcontextprotocol
- **MCP Discord**: Join the community for help and discussions

## Summary

You've now learned:
- ✅ What MCP is and why it's useful
- ✅ How to install and run MiniMCP
- ✅ How to test it with a client
- ✅ How the code works
- ✅ How to extend it with your own features

Happy coding! 🚀
