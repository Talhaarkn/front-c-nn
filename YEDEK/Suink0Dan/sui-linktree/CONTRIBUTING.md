# Contributing to Sui LinkTree

Thank you for your interest in contributing to Sui LinkTree! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and encourage diverse perspectives
- Focus on constructive criticism
- Follow the project's coding standards

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, browser, versions)
   - Screenshots if applicable

### Suggesting Features

1. Check if the feature has been suggested
2. Create an issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach
   - Any mockups or examples

### Pull Requests

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding style
   - Add tests if applicable
   - Update documentation
   - Keep commits atomic and well-described

4. **Test your changes**
   ```bash
   # Test Move contract
   cd move && sui move test
   
   # Test frontend
   cd frontend && npm run build
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add user profile search"
   ```

   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Clear title and description
   - Reference related issues
   - Explain what changed and why
   - Add screenshots for UI changes

## Development Setup

### Prerequisites

- Sui CLI
- Node.js 18+
- Walrus CLI
- Site Builder

### Local Development

1. Clone your fork
   ```bash
   git clone https://github.com/YOUR_USERNAME/sui-linktree.git
   cd sui-linktree
   ```

2. Install dependencies
   ```bash
   cd frontend
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. Run development server
   ```bash
   npm run dev
   ```

## Coding Standards

### Move (Smart Contract)

- Follow [Move coding conventions](https://move-book.com/style-guide/)
- Add comments for complex logic
- Write tests for all functions
- Use meaningful variable names
- Handle errors explicitly

Example:
```move
/// Creates a new LinkTree profile
/// Aborts if name already exists
public entry fun create_profile(
    registry: &mut ProfileRegistry,
    name: String,
    // ... other params
    ctx: &mut TxContext
) {
    // Validate
    assert!(!table::contains(&registry.names, name), ENameAlreadyExists);
    
    // Create profile
    let profile = LinkTreeProfile {
        // ...
    };
    
    // Register
    table::add(&mut registry.names, name, object::uid_to_address(&profile.id));
    
    // Share
    transfer::public_share_object(profile);
}
```

### JavaScript/React

- Use functional components with hooks
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use meaningful variable and function names
- Keep components small and focused
- Add PropTypes or TypeScript types
- Use async/await for async operations

Example:
```javascript
/**
 * Fetches a profile by ID from the blockchain
 * @param {string} profileId - The Sui object ID of the profile
 * @returns {Promise<Object>} The profile data
 */
export async function getProfileById(profileId) {
  try {
    const object = await suiClient.getObject({
      id: profileId,
      options: { showContent: true },
    });

    return parseProfileData(object.data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}
```

### CSS/Tailwind

- Use Tailwind utility classes
- Create custom utilities in index.css for repeated patterns
- Follow mobile-first approach
- Ensure accessibility (contrast, focus states)

## Testing

### Move Tests

```bash
cd move
sui move test
```

### Frontend Tests

```bash
cd frontend
npm run test  # If tests are added
```

### Manual Testing

1. Deploy contract to testnet
2. Update frontend config
3. Test all user flows:
   - Creating profile
   - Adding/editing/removing links
   - Updating profile settings
   - Viewing profiles
   - Wallet connection

## Documentation

- Update README.md for user-facing changes
- Update DOCUMENTATION.md for technical changes
- Add inline comments for complex code
- Update API documentation if applicable

## Questions?

- Open an issue for questions
- Join our Discord (if available)
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🚀

