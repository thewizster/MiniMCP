#!/usr/bin/env -S deno run --allow-all

/**
 * MiniMCP — Example server
 *
 * Demonstrates how to define tools, resources, and prompts
 * using the MiniMCP declarative API.  ~30 lines of actual logic.
 */

import { MiniMCP } from "./server.ts";

const mcp = new MiniMCP("minimcp");

// ── Tools ───────────────────────────────────────────────────────────────────

mcp.addTool({
  name: "echo",
  description: "Echoes back the input text.",
  inputs: {
    message: { type: "string", description: "The message to echo back" },
  },
  handler: ({ message }) => `Echo: ${message}`,
});

mcp.addTool({
  name: "add",
  description: "Adds two numbers together.",
  inputs: {
    a: { type: "number", description: "First number" },
    b: { type: "number", description: "Second number" },
  },
  handler: ({ a, b }) => `${a} + ${b} = ${(a as number) + (b as number)}`,
});

// ── Resources ───────────────────────────────────────────────────────────────

mcp.addResource({
  uri: "greeting://hello",
  name: "Hello Greeting",
  description: "A simple greeting message",
  handler: () => "Hello from MiniMCP!",
});

// ── Prompts ─────────────────────────────────────────────────────────────────

mcp.addPrompt({
  name: "greeting",
  description: "A customizable greeting prompt",
  args: [{ name: "name", description: "Name of the person to greet", required: true }],
  handler: ({ name }) => `Hello ${name}! Welcome to MiniMCP.`,
});

// ── Start ───────────────────────────────────────────────────────────────────

mcp.start().catch((err) => {
  console.error("Fatal:", err);
  Deno.exit(1);
});
