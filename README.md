# @creadev.org/auth

> Auth - sessions, tokens

[![npm](https://img.shields.io/npm/v/@creadev.org/auth)](https://www.npmjs.com/package/@creadev.org/auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Install

```bash
npm install @creadev.org/auth
```

## Usage

```typescript
import { Auth, createAuth, createSession, validateSession, validateToken } from '@creadev.org/auth';

const auth = createAuth();
const token = await createSession('user-id');
const isValid = await validateSession(token);
const user = await validateToken(token);
```

## API

| Function | Description |
|----------|-------------|
| `createAuth(options?)` | Create auth |
| `createSession(userId)` | Create session |
| `validateSession(token)` | Validate session |
| `validateToken(token)` | Validate token |

## License

MIT
trigger
