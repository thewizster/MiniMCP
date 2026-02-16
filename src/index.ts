#!/usr/bin/env -S deno run --allow-all

/**
 * MiniMCP - A Minimalistic Model Context Protocol (MCP) Server
 * 
 * This server demonstrates the basic functionality of an MCP server:
 * - Tools: Functions that can be called by the client
 * - Resources: Data that can be read by the client
 * - Prompts: Templates that can be used by the client
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Initialize the MCP server
const server = new Server(
  {
    name: "minimcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

/**
 * Tools: Functions that the MCP client can call
 * 
 * This example includes two simple tools:
 * 1. echo - Returns the input text
 * 2. add - Adds two numbers together
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "echo",
        description: "Echoes back the input text. Useful for testing the server connection.",
        inputSchema: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "The message to echo back",
            },
          },
          required: ["message"],
        },
      },
      {
        name: "add",
        description: "Adds two numbers together and returns the result.",
        inputSchema: {
          type: "object",
          properties: {
            a: {
              type: "number",
              description: "The first number",
            },
            b: {
              type: "number",
              description: "The second number",
            },
          },
          required: ["a", "b"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "echo": {
      const message = args.message as string;
      return {
        content: [
          {
            type: "text",
            text: `Echo: ${message}`,
          },
        ],
      };
    }

    case "add": {
      const a = args.a as number;
      const b = args.b as number;
      const result = a + b;
      return {
        content: [
          {
            type: "text",
            text: `The sum of ${a} and ${b} is ${result}`,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

/**
 * Resources: Data that the MCP client can read
 * 
 * This example includes a simple greeting resource
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "greeting://hello",
        name: "Hello Greeting",
        description: "A simple greeting message",
        mimeType: "text/plain",
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === "greeting://hello") {
    return {
      contents: [
        {
          uri: uri,
          mimeType: "text/plain",
          text: "Hello from MiniMCP! This is a simple resource example.",
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

/**
 * Prompts: Templates that the MCP client can use
 * 
 * This example includes a simple greeting prompt template
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "greeting",
        description: "A customizable greeting prompt",
        arguments: [
          {
            name: "name",
            description: "The name of the person to greet",
            required: true,
          },
        ],
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "greeting") {
    const userName = args?.name as string || "friend";
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Hello ${userName}! Welcome to MiniMCP. How can I assist you today?`,
          },
        },
      ],
    };
  }

  throw new Error(`Unknown prompt: ${name}`);
});

/**
 * Start the server using stdio transport
 * This allows the server to communicate via standard input/output
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr (not stdout, which is used for MCP communication)
  console.error("MiniMCP server started successfully");
  console.error("Server capabilities: tools, resources, prompts");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  Deno.exit(1);
});
