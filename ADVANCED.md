# Advanced Guide: Extending MiniMCP

This guide helps you extend MiniMCP with more advanced features.

## Adding New Tools

Tools are functions that the AI can call. Here's how to add a new tool:

### Example: Weather Tool (Mock)

```typescript
// 1. Add to ListToolsRequestSchema handler
{
  name: "get_weather",
  description: "Get the current weather for a location",
  inputSchema: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "City name or coordinates"
      },
      units: {
        type: "string",
        enum: ["celsius", "fahrenheit"],
        description: "Temperature units",
        default: "celsius"
      }
    },
    required: ["location"]
  }
}

// 2. Add to CallToolRequestSchema handler
case "get_weather": {
  const location = args.location as string;
  const units = (args.units as string) || "celsius";
  
  // In a real implementation, you'd call a weather API here
  const temp = units === "celsius" ? 22 : 72;
  
  return {
    content: [{
      type: "text",
      text: `The weather in ${location} is ${temp}°${units === "celsius" ? "C" : "F"} and sunny.`
    }]
  };
}
```

## Adding Dynamic Resources

Resources can be dynamic - they don't have to be static data.

### Example: File System Resource

```typescript
// List resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  // You could read from a directory here
  const files = ["file1.txt", "file2.txt"];
  
  return {
    resources: files.map(file => ({
      uri: `file:///${file}`,
      name: file,
      description: `Content of ${file}`,
      mimeType: "text/plain"
    }))
  };
});

// Read resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  if (uri.startsWith("file:///")) {
    const filename = uri.replace("file:///", "");
    
    try {
      // In Deno, you can read files like this:
      const content = await Deno.readTextFile(filename);
      
      return {
        contents: [{
          uri: uri,
          mimeType: "text/plain",
          text: content
        }]
      };
    } catch (error) {
      throw new Error(`Could not read file: ${error.message}`);
    }
  }
  
  throw new Error(`Unknown resource: ${uri}`);
});
```

## Adding Complex Prompts

Prompts can include system messages and multiple turns.

### Example: Code Review Prompt

```typescript
{
  name: "code_review",
  description: "Generate a code review prompt",
  arguments: [
    {
      name: "language",
      description: "Programming language",
      required: true
    },
    {
      name: "code",
      description: "The code to review",
      required: true
    }
  ]
}

// In GetPromptRequestSchema handler:
case "code_review": {
  const language = args?.language as string;
  const code = args?.code as string;
  
  return {
    messages: [
      {
        role: "system",
        content: {
          type: "text",
          text: "You are an expert code reviewer. Provide constructive feedback."
        }
      },
      {
        role: "user",
        content: {
          type: "text",
          text: `Please review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
        }
      }
    ]
  };
}
```

## Error Handling

Always validate inputs and provide clear error messages:

```typescript
case "divide": {
  const a = args.a as number;
  const b = args.b as number;
  
  // Validate inputs
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Both arguments must be numbers");
  }
  
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  
  return {
    content: [{
      type: "text",
      text: `${a} ÷ ${b} = ${a / b}`
    }]
  };
}
```

## Async Operations

Tools can perform async operations like API calls:

```typescript
case "fetch_url": {
  const url = args.url as string;
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    return {
      content: [{
        type: "text",
        text: text.substring(0, 1000) // Limit response size
      }]
    };
  } catch (error) {
    throw new Error(`Failed to fetch URL: ${error.message}`);
  }
}
```

## Working with Binary Data

Resources can return binary data (images, PDFs, etc.):

```typescript
{
  uri: "image://logo.png",
  name: "Company Logo",
  mimeType: "image/png"
}

// In ReadResourceRequestSchema:
const imageData = await Deno.readFile("logo.png");
const base64 = btoa(String.fromCharCode(...imageData));

return {
  contents: [{
    uri: uri,
    mimeType: "image/png",
    blob: base64
  }]
};
```

## State Management

If you need to maintain state across calls:

```typescript
// At the top of your file
const state = {
  counter: 0,
  history: [] as string[]
};

// In a tool
case "increment": {
  state.counter++;
  state.history.push(`Incremented to ${state.counter}`);
  
  return {
    content: [{
      type: "text",
      text: `Counter is now ${state.counter}`
    }]
  };
}
```

## Permissions in Deno

For production, use specific permissions instead of `--allow-all`:

```bash
# Read specific directory
deno run --allow-read=/path/to/data src/index.ts

# Network access to specific domain
deno run --allow-net=api.example.com src/index.ts

# Combine multiple permissions
deno run --allow-read --allow-net=api.example.com --allow-env src/index.ts
```

## Testing Your Tools

Create a simple test script:

```typescript
// test.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server(/* your config */);

// Set up your handlers...

// Test a tool
const result = await server.handleRequest({
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "echo",
    arguments: { message: "test" }
  }
});

console.log(result);
```

## Best Practices

1. **Validate all inputs** - Never trust user input
2. **Limit response sizes** - Don't return huge amounts of data
3. **Use descriptive names** - Make tools/resources/prompts self-documenting
4. **Handle errors gracefully** - Provide helpful error messages
5. **Document your tools** - Use clear descriptions and schemas
6. **Keep tools focused** - Each tool should do one thing well
7. **Consider security** - Don't expose sensitive data or dangerous operations

## Real-World Examples

### Database Query Tool

```typescript
case "query_db": {
  const query = args.query as string;
  
  // In a real app, use parameterized queries!
  // This is just an example
  const results = await db.query(query);
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(results, null, 2)
    }]
  };
}
```

### File Search Tool

```typescript
case "search_files": {
  const pattern = args.pattern as string;
  const results = [];
  
  for await (const entry of Deno.readDir(".")) {
    if (entry.name.includes(pattern)) {
      results.push(entry.name);
    }
  }
  
  return {
    content: [{
      type: "text",
      text: `Found ${results.length} files:\n${results.join("\n")}`
    }]
  };
}
```

## Next Steps

- Read the [MCP specification](https://modelcontextprotocol.io/specification)
- Check out the [SDK documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- Join the MCP community to share your creations!

Happy coding! 🚀
