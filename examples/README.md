# Examples

## Testing With JSON-RPC

The MCP server communicates using JSON-RPC 2.0 over stdio. You can pipe requests directly:

### Initialize

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": { "name": "test", "version": "1.0" }
  }
}
```

### List Tools

```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {} }
```

### Call a Tool

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": { "name": "echo", "arguments": { "message": "Hello!" } }
}
```

### Read a Resource

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "resources/read",
  "params": { "uri": "greeting://hello" }
}
```

### Get a Prompt

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "prompts/get",
  "params": { "name": "greeting", "arguments": { "name": "Alice" } }
}
```

## Using the MCP Inspector

The easiest way to test interactively:

```bash
npx @modelcontextprotocol/inspector deno run --allow-all src/index.ts
```

See [GETTING_STARTED.md](../GETTING_STARTED.md) for Claude Desktop setup.
