import assert from "node:assert";
import { MiniMCP } from "./server.ts";

Deno.test("addTool registers a tool and returns this", () => {
  const mcp = new MiniMCP("test");
  const result = mcp.addTool({
    name: "echo",
    description: "Echoes input",
    inputs: { message: { type: "string", description: "msg" } },
    handler: ({ message }) => `Echo: ${message}`,
  });
  assert.strictEqual(result, mcp);
});

Deno.test("addResource registers a resource and returns this", () => {
  const mcp = new MiniMCP("test");
  const result = mcp.addResource({
    uri: "test://hello",
    name: "Hello",
    description: "A greeting",
    handler: () => "Hello!",
  });
  assert.strictEqual(result, mcp);
});

Deno.test("addPrompt registers a prompt and returns this", () => {
  const mcp = new MiniMCP("test");
  const result = mcp.addPrompt({
    name: "greet",
    description: "Greet someone",
    args: [{ name: "name", description: "Name", required: true }],
    handler: ({ name }) => `Hi ${name}!`,
  });
  assert.strictEqual(result, mcp);
});

Deno.test("chaining works", () => {
  const mcp = new MiniMCP("test");
  const result = mcp
    .addTool({
      name: "t1",
      description: "Tool 1",
      inputs: {},
      handler: () => "ok",
    })
    .addResource({
      uri: "r://1",
      name: "R1",
      description: "Resource 1",
      handler: () => "data",
    })
    .addPrompt({
      name: "p1",
      description: "Prompt 1",
      handler: () => "hello",
    });
  assert.strictEqual(result, mcp);
});
