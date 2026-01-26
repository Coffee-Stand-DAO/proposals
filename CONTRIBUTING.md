# Contributing to Coffee-Stand-DAO Proposals

Thank you for your interest in contributing to Coffee-Stand-DAO Proposals!

## How to Contribute

### Reporting Issues

1. Check if the issue already exists
2. Create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce (if applicable)
   - Expected behavior

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Development Setup

```bash
# Clone the repository
git clone https://github.com/Coffee-Stand-DAO/proposals.git
cd proposals

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env
```

## Running Scripts

### Transfer Funds

```bash
# Dry run (simulation)
npm run transfer:funds:dry-run

# Actual transfer
npm run transfer:funds

# With specific amount
node scripts/transfer-funds.js --amount 100

# With ERC20 token
node scripts/transfer-funds.js --token 0x1234...abcd
```

## Code Style

- Use 2 spaces for indentation
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed

## Commit Messages

Use conventional commit format:

```
feat: add new feature
fix: fix bug
docs: update documentation
refactor: refactor code
test: add tests
chore: maintenance tasks
```

## Pull Request Guidelines

- Describe your changes clearly
- Reference any related issues
- Ensure all CI checks pass
- Request review from core team members

## Questions?

Feel free to open an issue for questions or discussions!
