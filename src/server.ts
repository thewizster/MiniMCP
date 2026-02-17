/**
 * MiniMCP Server — A tiny, declarative wrapper around the MCP SDK.
 *
 * Define tools, resources, and prompts with plain objects.
 * No boilerplate. No ceremony.
 */

import { Server } from "npm:@modelcontextprotocol/sdk@1.26.0/server/index.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk@1.26.0/server/stdio.js";
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "npm:@modelcontextprotocol/sdk@1.26.0/types.js";

// ── Public types ────────────────────────────────────────────────────────────

/** A JSON-Schema-style property definition. */
export interface PropSchema {
  type: string;
  description: string;
  enum?: string[];
  default?: unknown;
}

/** A tool that the AI client can call. */
export interface ToolDef {
  name: string;
  description: string;
  inputs: Record<string, PropSchema>;
  required?: string[];
  handler: (args: Record<string, unknown>) => unknown | Promise<unknown>;
}

/** A resource the AI client can read. */
export interface ResourceDef {
  uri: string;
  name: string;
  description: string;
  mimeType?: string;
  handler: () => string | Promise<string>;
}

/** An argument accepted by a prompt. */
export interface PromptArg {
  name: string;
  description: string;
  required?: boolean;
}

/** A prompt template the AI client can use. */
export interface PromptDef {
  name: string;
  description: string;
  args?: PromptArg[];
  handler: (
    args: Record<string, unknown>,
  ) => string | Promise<string>;
}

// ── MiniMCP class ───────────────────────────────────────────────────────────

export class MiniMCP {
  private tools: ToolDef[] = [];
  private resources: ResourceDef[] = [];
  private prompts: PromptDef[] = [];
  private serverName: string;
  private serverVersion: string;

  constructor(name: string, version = "1.0.0") {
    this.serverName = name;
    this.serverVersion = version;
  }

  /** Register a tool. */
  addTool(def: ToolDef): this {
    this.tools.push(def);
    return this;
  }

  /** Register a resource. */
  addResource(def: ResourceDef): this {
    this.resources.push(def);
    return this;
  }

  /** Register a prompt. */
  addPrompt(def: PromptDef): this {
    this.prompts.push(def);
    return this;
  }

  /** Start the MCP server over stdio. */
  async start(): Promise<void> {
    const server = new Server(
      { name: this.serverName, version: this.serverVersion },
      {
        capabilities: {
          ...(this.tools.length > 0 ? { tools: {} } : {}),
          ...(this.resources.length > 0 ? { resources: {} } : {}),
          ...(this.prompts.length > 0 ? { prompts: {} } : {}),
        },
      },
    );

    this.registerTools(server);
    this.registerResources(server);
    this.registerPrompts(server);

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error(`MiniMCP "${this.serverName}" started`);
  }

  // ── Internal wiring ────────────────────────────────────────────────────

  private registerTools(server: Server): void {
    if (this.tools.length === 0) return;

    const toolDefs = this.tools;

    server.setRequestHandler(ListToolsRequestSchema, () => ({
      tools: toolDefs.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: {
          type: "object" as const,
          properties: t.inputs,
          required: t.required ?? Object.keys(t.inputs),
        },
      })),
    }));

    server.setRequestHandler(CallToolRequestSchema, async (req) => {
      const { name, arguments: args } = req.params;
      const tool = toolDefs.find((t) => t.name === name);
      if (!tool) throw new Error(`Unknown tool: ${name}`);

      const result = await tool.handler(args ?? {});
      const text = typeof result === "string" ? result : JSON.stringify(result);

      return { content: [{ type: "text", text }] };
    });
  }

  private registerResources(server: Server): void {
    if (this.resources.length === 0) return;

    const resourceDefs = this.resources;

    server.setRequestHandler(ListResourcesRequestSchema, () => ({
      resources: resourceDefs.map((r) => ({
        uri: r.uri,
        name: r.name,
        description: r.description,
        mimeType: r.mimeType ?? "text/plain",
      })),
    }));

    server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
      const { uri } = req.params;
      const resource = resourceDefs.find((r) => r.uri === uri);
      if (!resource) throw new Error(`Unknown resource: ${uri}`);

      const text = await resource.handler();

      return {
        contents: [{
          uri,
          mimeType: resource.mimeType ?? "text/plain",
          text,
        }],
      };
    });
  }

  private registerPrompts(server: Server): void {
    if (this.prompts.length === 0) return;

    const promptDefs = this.prompts;

    server.setRequestHandler(ListPromptsRequestSchema, () => ({
      prompts: promptDefs.map((p) => ({
        name: p.name,
        description: p.description,
        arguments: p.args?.map((a) => ({
          name: a.name,
          description: a.description,
          required: a.required ?? false,
        })),
      })),
    }));

    server.setRequestHandler(GetPromptRequestSchema, async (req) => {
      const { name, arguments: args } = req.params;
      const prompt = promptDefs.find((p) => p.name === name);
      if (!prompt) throw new Error(`Unknown prompt: ${name}`);

      const text = await prompt.handler(args ?? {});

      return {
        messages: [{
          role: "user",
          content: { type: "text", text },
        }],
      };
    });
  }
}
