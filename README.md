# @justmiracle/result

A minimal implementation of the Result type in TypeScript. Allowing you to handle success and error states in a more explicit and structured way.

### Installation

```bash
npm install @justmiracle/result

yarn add @justmiracle/result

pnpm add @justmiracle/result

bun add @justmiracle/result
```

### Docs

- [API](#api)
- [Creating a Result](#creating-a-result)
- [Checking Result Type](#checking-result-type)
- [Unwrapping Result](#unwrapping-result)
- [TypeScript Error Type Inference](#typescript-error-type-inference)

### API

```ts
// A result is either successful or an error
export type Result<T, E> = Ok<T> | Err<E>;

// A successful result contains a value and null for error
export type Ok<T> = { value: T; error: null };

// An error result contains null for value and an error
export type Err<E> = { value: null; error: E };
```

### Creating a Result

You can create a result using the `ok` or `err` function:

```typescript
import { ok, err, Result } from '@justmiracle/result';

const successResult: Result<number, string> = ok(42);
// { value: 42, error: null }

const errorResult: Result<number, string> = err('Something went wrong');
// { value: null, error: 'Something went wrong' }

const errorResult2: Result<number, Error> = err(new Error('Another error'));
// { value: null, error: Error }
```

### Checking Result Type

You can check if a result is successful using the `isOk` function:

```typescript
if (isOk(successResult)) {
  console.log('Success:', successResult.value);
} else {
  console.error('Error:', successResult.error);
}
```

You can check if a result is an error using the `isErr` function:

```typescript
if (isErr(errorResult)) {
  console.error('Error:', errorResult.error);
} else {
  console.log('Success:', errorResult.value);
}
```

You can also check for error directly:

```typescript
const result = someFunctionReturningResult();
if (result.error) {
  // Handle error
  console.error('Error:', result.error);
  return result;
}
// Otherwise, handle success
console.log('Success:', result.value);
```

You can also check for a successful value directly:

```typescript
const result = someFunctionReturningResult();
if (result.value !== null) {
  // Handle success
  console.log('Success:', result.value);
} else {
  // Handle error
  console.error('Error:', result.error);
}
```

### Unwrapping Result

You can unwrap the value from a result type using `unwrapOr`, this will return the value if the result is successful or a default value if it's an error:

```typescript
const resultOne = ok(42);
const value = unwrapOr(resultOne, 12); // 42

const resultTwo = err('Something went wrong');
const value2 = unwrapOr(resultTwo, 12); // 12 (default value)
```

You can also unwrap the value from a successful result using `unwrap`, which throws an error for an error result:

> [!WARNING]
> This will throw the error if the result is an error, so make sure to handle it properly.

```typescript
const resultOne = ok(42);
const value = unwrap(resultOne); // 42

const resultTwo = err('Something went wrong');
const value2 = unwrap(resultTwo); // throws 'Something went wrong'
```

### TypeScript Error Type Inference

#### ⚠️ Error Union Inference Limitation

When you return multiple different `err("...")` values from a function, TypeScript will infer the return type as a union of separate `Err<...>` types (e.g., `Ok<42> | Err<"A"> | Err<"B">`), **not** as a merged `Err<"A" | "B">`.

**Best Practice:**
If you want the error type to be a union (e.g., `Ok<42> | Err<"A" | "B">`), explicitly annotate your function's return type:

```typescript
function test(): Ok<42> | Err<"A" | "B"> {
  if (something) return err("A");
  if (other) return ok(42);
  return err("B");
}
```

If you do not annotate, TypeScript will infer:
```typescript
function test() {
  if (something) return err("A");
  if (other) return ok(42);
  return err("B");
}
// Inferred: Ok<42> | Err<"A"> | Err<"B">
```

This is a TypeScript limitation. See [TypeScript Issue #14094](https://github.com/microsoft/TypeScript/issues/14094) for more details.

### Roadmap

- [ ] Typesafe error handling
- [ ] `pipe` function

### Contributing

Contributions are welcome, feel free to open an issue or a pull request.🌰
