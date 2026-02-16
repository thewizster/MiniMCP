# MiniMCP

A minimalistic, fully functional Model Context Protocol (MCP) server built with TypeScript and Deno. Perfect for learning and understanding how MCP servers work!

## 🚀 Quick Start

```bash
# Install Deno (if not already installed)
curl -fsSL https://deno.land/install.sh | sh

# Clone and run
git clone https://github.com/thewizster/MiniMCP.git
cd MiniMCP
deno task start
```

## 📖 What is MiniMCP?

MiniMCP is a beginner-friendly MCP server that demonstrates the three core capabilities:

- **🔧 Tools**: Simple functions (echo, add) that AI can call
- **📦 Resources**: Data sources (greeting message) that AI can read  
- **💬 Prompts**: Templates (greeting) that AI can use

## ✨ Features

- ✅ Fully functional MCP server implementation
- ✅ Written in TypeScript for type safety
- ✅ Uses Deno for modern JavaScript runtime
- ✅ Includes example tools, resources, and prompts
- ✅ Well-commented code for learning
- ✅ Comprehensive getting started guide

## 📚 Documentation

**New to MCP?** Start here: [GETTING_STARTED.md](GETTING_STARTED.md)

The getting started guide covers:
- What is MCP and why it's useful
- Step-by-step installation instructions
- How to run and test the server
- Detailed code explanations
- How to extend with your own features

**Additional Resources:**
- [FAQ.md](FAQ.md) - Frequently asked questions and troubleshooting
- [ADVANCED.md](ADVANCED.md) - Advanced features and real-world examples
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guidelines for contributors

## 🛠️ What's Included

### Tools
- `echo` - Returns your input message (great for testing)
- `add` - Adds two numbers together

### Resources
- `greeting://hello` - A simple greeting message

### Prompts
- `greeting` - A customizable greeting prompt template

## 🏗️ Project Structure

```
MiniMCP/
├── src/
│   └── index.ts          # Main server implementation
├── deno.json             # Deno configuration and tasks
├── GETTING_STARTED.md    # Comprehensive beginner guide
└── README.md             # This file
```

## 🧪 Testing

### Option 1: Claude Desktop
Configure Claude Desktop to connect to MiniMCP and test the tools interactively.

### Option 2: MCP Inspector
```bash
npx @modelcontextprotocol/inspector deno run --allow-all src/index.ts
```

See [GETTING_STARTED.md](GETTING_STARTED.md) for detailed testing instructions.

## 🎓 Learning Path

1. Read [GETTING_STARTED.md](GETTING_STARTED.md) to understand MCP basics
2. Run the server and test it with a client
3. Read through `src/index.ts` - it's well commented!
4. Try adding your own tool, resource, or prompt
5. Build something useful!

## 🤝 Contributing

This is a learning project! Feel free to:
- Report issues
- Suggest improvements
- Submit pull requests
- Share what you built!

## 📝 License

MIT License - feel free to use this for learning and building!

## 🔗 Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Deno Documentation](https://deno.land/manual)
- [MCP GitHub Repository](https://github.com/modelcontextprotocol)

---

Built with ❤️ for learning MCP
