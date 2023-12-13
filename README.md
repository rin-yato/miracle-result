# @miralce/result

A simple result type wrapper for TypeScript.

### Installation

```bash
npm install @miralce/result
# or
yarn add @miralce/result
# or 
pnpm add @miralce/result
# or
bun add @miralce/result
```

### Getting Started

```ts
import { Result, ok, err } from '@miralce/result'

type User = {
  name: string
  age: number
}

const data: Result<User> = await getData().then(ok).catch(err)

if (data.error) {
  console.error(data.error)
} else {
  console.log(data.value, data.value.name)
}
```

> [!NOTE]
> More documentation coming soon.



