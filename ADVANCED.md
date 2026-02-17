# Advanced Guide

Patterns for building real-world MCP servers with MiniMCP.

## Async Tools

Tool handlers can be `async`. Fetch data, read files, query APIs:

```typescript
mcp.addTool({
  name: "fetch_url",
  description: "Fetches a URL and returns the first 1000 characters.",
  inputs: {
    url: { type: "string", description: "URL to fetch" },
  },
  handler: async ({ url }) => {
    const res = await fetch(url as string);
    const text = await res.text();
    return text.substring(0, 1000);
  },
});
```

Remember to add `--allow-net` when running.

## File System Tools

Read files from disk using Deno APIs:

```typescript
mcp.addTool({
  name: "read_file",
  description: "Reads a text file.",
  inputs: {
    path: { type: "string", description: "File path" },
  },
  handler: async ({ path }) => await Deno.readTextFile(path as string),
});
```

Run with `--allow-read` for the directories you need.

## Dynamic Resources

Resource handlers can do anything — read files, call APIs, compute values:

```typescript
mcp.addResource({
  uri: "system://info",
  name: "System Info",
  description: "Current system information",
  handler: () =>
    JSON.stringify({
      os: Deno.build.os,
      arch: Deno.build.arch,
      deno: Deno.version.deno,
    }),
});
```

## Input Validation

Validate inside your handler and throw on bad input:

```typescript
mcp.addTool({
  name: "divide",
  description: "Divides two numbers.",
  inputs: {
    a: { type: "number", description: "Numerator" },
    b: { type: "number", description: "Denominator" },
  },
  handler: ({ a, b }) => {
    if ((b as number) === 0) throw new Error("Cannot divide by zero");
    return `${a} ÷ ${b} = ${(a as number) / (b as number)}`;
  },
});
```

The MCP SDK serializes the error automatically.

## Optional Inputs

Only list required fields in `required`. Omitted fields default to all keys being required. Override
with an explicit array:

```typescript
mcp.addTool({
  name: "greet",
  description: "Greet someone.",
  inputs: {
    name: { type: "string", description: "Name" },
    style: { type: "string", description: "Greeting style", enum: ["formal", "casual"] },
  },
  required: ["name"], // style is optional
  handler: ({ name, style }) => {
    const s = (style as string) ?? "casual";
    return s === "formal" ? `Good day, ${name}.` : `Hey ${name}!`;
  },
});
```

## Returning Structured Data

Return an object or array from a tool handler — it gets JSON-serialized automatically:

```typescript
mcp.addTool({
  name: "list_files",
  description: "Lists files in current directory.",
  inputs: {},
  handler: async () => {
    const files: string[] = [];
    for await (const entry of Deno.readDir(".")) {
      files.push(entry.name);
    }
    return files; // sent as JSON
  },
});
```

## Deno Permissions

For production, replace `--allow-all` with specific permissions:

```bash
deno run --allow-read=/data --allow-net=api.example.com src/index.ts
```

## Best Practices

1. **Validate inputs** — never trust them blindly
2. **Keep handlers focused** — one tool, one job
3. **Limit response size** — truncate large outputs
4. **Use descriptive names** — tools are self-documenting for the AI
5. **Log with `console.error()`** — stdout is for the MCP protocol

## Next Steps

- Read the [MCP spec](https://modelcontextprotocol.io/specification)
- Explore the [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- Build something and share it!
