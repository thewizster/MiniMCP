# Contributing to MiniMCP

Thank you for your interest in contributing to MiniMCP! This project is designed to help people learn about MCP servers, and we welcome contributions that make it better.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists
2. Create a new issue with a clear title and description
3. Include steps to reproduce (for bugs)
4. Include your environment details (Deno version, OS, etc.)

### Submitting Changes

1. **Fork the repository** and create a new branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding style:
   - Use TypeScript strict mode
   - Follow existing code formatting (2 spaces, semicolons)
   - Add comments for complex logic
   - Keep it simple - this is a learning project!

3. **Test your changes**
   ```bash
   deno task start
   ```

4. **Format your code**
   ```bash
   deno fmt
   ```

5. **Lint your code**
   ```bash
   deno lint
   ```

6. **Commit your changes** with a clear message
   ```bash
   git commit -m "Add feature: description"
   ```

7. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## What We're Looking For

### Good Contributions

- Bug fixes
- Documentation improvements
- Simple, educational examples
- Performance improvements
- Better error messages
- More beginner-friendly explanations

### Not Suitable

- Complex features that obscure learning
- Dependencies that aren't necessary
- Breaking changes without discussion
- Code that's hard to understand

## Code Style

- Use **TypeScript** with strict mode
- Follow the **existing code structure**
- Add **comments** to explain concepts
- Keep functions **small and focused**
- Use **descriptive variable names**

## Documentation

When adding features, please update:
- Code comments
- README.md (if it affects main features)
- GETTING_STARTED.md (if it affects setup/usage)
- ADVANCED.md (if it's an advanced feature)

## Testing

Currently, MiniMCP doesn't have automated tests. When testing your changes:

1. Start the server: `deno task start`
2. Test with Claude Desktop or MCP Inspector
3. Verify all tools/resources/prompts work
4. Check error handling

## Questions?

Feel free to:
- Open an issue for discussion
- Ask in your Pull Request
- Check the [MCP documentation](https://modelcontextprotocol.io)

## Code of Conduct

Be respectful, kind, and constructive. This is a learning community!

Thank you for helping make MCP more accessible to everyone! 🎉
