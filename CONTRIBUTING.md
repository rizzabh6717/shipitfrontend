# Contributing to ShipIT Delivery Platform

Thank you for your interest in contributing to ShipIT! We welcome contributions from the community and are pleased to have you join us.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/shipit-delivery-platform.git
   cd shipit-delivery-platform
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```

## Development Process

### Branch Naming Convention

- `feature/description` - for new features
- `bugfix/description` - for bug fixes
- `hotfix/description` - for urgent fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**
```
feat(tracking): add real-time location updates
fix(wallet): resolve MetaMask connection issue
docs(readme): update installation instructions
```

## Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes** with descriptive commit messages

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Testing instructions

### Pull Request Requirements

- [ ] Code follows the project's coding standards
- [ ] All tests pass
- [ ] Documentation is updated if needed
- [ ] No merge conflicts
- [ ] PR description clearly explains the changes
- [ ] Screenshots included for UI changes

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types and interfaces
- Implement proper error boundaries

### Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Ensure responsive design
- Use consistent spacing and colors

### File Organization

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in objects and arrays
- Use meaningful component and variable names
- Add comments for complex logic

## Testing Guidelines

### Unit Tests

- Write tests for utility functions
- Test custom hooks
- Test component logic

### Integration Tests

- Test user workflows
- Test API integrations
- Test wallet connections

### Manual Testing

- Test on different browsers
- Test responsive design
- Test with different wallet states
- Test error scenarios

## Documentation

### Code Documentation

- Add JSDoc comments for functions and components
- Document complex algorithms
- Include usage examples

### README Updates

- Update installation instructions if needed
- Document new features
- Update configuration examples

### API Documentation

- Document new API endpoints
- Include request/response examples
- Document error codes

## Issue Reporting

When reporting issues, please include:

1. **Environment details**:
   - OS and version
   - Browser and version
   - Node.js version
   - npm/yarn version

2. **Steps to reproduce**:
   - Clear step-by-step instructions
   - Expected vs actual behavior
   - Screenshots or videos if applicable

3. **Additional context**:
   - Error messages
   - Console logs
   - Network requests

## Feature Requests

When requesting features:

1. **Use case**: Explain why this feature is needed
2. **Proposed solution**: Describe your ideal solution
3. **Alternatives**: Mention alternative solutions considered
4. **Additional context**: Add mockups, examples, or references

## Getting Help

- **Discord**: Join our [Discord community](https://discord.gg/shipit)
- **GitHub Issues**: Create an issue for bugs or feature requests
- **Email**: Contact us at dev@shipit-delivery.com

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Discord announcements

Thank you for contributing to ShipIT! 🚀