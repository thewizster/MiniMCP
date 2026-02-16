# Examples

This directory contains example files to help you understand and test MiniMCP.

## Testing the Server Manually

The MCP server communicates using JSON-RPC 2.0 over stdio. Here are some example requests you can send:

### 1. Initialize the connection

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {
      "name": "test-client",
      "version": "1.0.0"
    }
  }
}
```

### 2. List available tools

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {}
}
```

### 3. Call the echo tool

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "echo",
    "arguments": {
      "message": "Hello, MCP!"
    }
  }
}
```

### 4. Call the add tool

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "add",
    "arguments": {
      "a": 5,
      "b": 3
    }
  }
}
```

### 5. List available resources

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "resources/list",
  "params": {}
}
```

### 6. Read a resource

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "resources/read",
  "params": {
    "uri": "greeting://hello"
  }
}
```

### 7. List available prompts

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "prompts/list",
  "params": {}
}
```

### 8. Get a prompt

```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "method": "prompts/get",
  "params": {
    "name": "greeting",
    "arguments": {
      "name": "Alice"
    }
  }
}
```

## Using with a Test Script

You can pipe these requests to the server using a shell script or programming language of your choice. For example:

```bash
# Start the server
deno task start

# In another terminal, send a request
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | deno run --allow-all src/index.ts
```

## Integration Examples

See the [GETTING_STARTED.md](../GETTING_STARTED.md) guide for information on:
- Integrating with Claude Desktop
- Using the MCP Inspector
- Building your own MCP client
