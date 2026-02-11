# Contributing to HR Management System

Thank you for your interest in contributing to the HR Management System! This document provides guidelines for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

## Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test them thoroughly

3. Commit your changes with descriptive messages:
   ```bash
   git commit -m "feat: add new feature description"
   ```

4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request

## Code Style Guidelines

### Backend (Node.js/Express)
- Use ES6+ features
- Follow consistent naming conventions
- Add proper error handling
- Include input validation
- Use meaningful variable names

### Frontend (React/TypeScript)
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper loading states
- Use Tailwind CSS for styling

### General
- Write clean, readable code
- Add comments for complex logic
- Follow existing code patterns
- Test your changes thoroughly

## Pull Request Process

1. **Title**: Use clear, descriptive titles
2. **Description**: Explain what you changed and why
3. **Testing**: Mention how you tested your changes
4. **Screenshots**: Add screenshots for UI changes
5. **Breaking Changes**: Clearly mark any breaking changes

## Issue Reporting

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Node.js version)
- Screenshots if applicable

## Project Structure

```
hr-management-system/
├── backend/                 # Node.js/Express API
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env.example       # Environment template
├── frontend/               # React/TypeScript app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   └── App.tsx       # Main app component
│   ├── public/            # Static assets
│   └── package.json      # Frontend dependencies
├── README.md              # Project documentation
├── LICENSE               # MIT License
└── .gitignore           # Git ignore rules
```

## Coding Standards

### Commit Messages
Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### Code Review Process
1. All PRs require review
2. Ensure CI/CD passes
3. Maintain test coverage
4. Update documentation as needed

## Questions?

Feel free to open an issue for questions or clarification. We're here to help!

Thank you for contributing! 🚀
