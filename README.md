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

- [@justmiracle/result](#justmiracleresult)
    - [Installation](#installation)
    - [Docs](#docs)
    - [API](#api)
    - [Creating a Result](#creating-a-result)
    - [Checking Result Type](#checking-result-type)
    - [Unwrapping Result](#unwrapping-result)
    - [Transforming Result](#transforming-result)
    - [Roadmap](#roadmap)
    - [Contributing](#contributing)


### API

> [!FUTURE]
> This might change a little in the future, but the core concepts will remain the same.
> I will try to make it so Err can be typed as `Error | AnyErrorType`, this will make it easier to use with custom error types.
  
```typescript
// A result is either successful or an error
type Result<T> = Ok<T> | Err;

// A successful result contains a value and null for error
type Ok<T> = { value: T; error: null };

// An error result contains null for value and an error
type Err = { value: null; error: Error };
```


### Creating a Result

You can create a result using the `ok` or `err` function:

```typescript
import { ok, err } from '@justmiracle/result';

const successResult: Result<number> = ok(42);
// { value: 42, error: null }

const errorResult: Result<number> = err(new Error("Something went wrong"));
// { value: null, error: Error }

// error can be anything, if the function detect that it's not an error it will be converted to an error
const errorResult: Result<number> = err("Something went wrong");
// { value: null, error: Error } the same as above
```


### Checking Result Type

You can check if a result is successful using the `isOk` function:

```typescript
if (isOk(successResult)) {
  console.log("Success:", successResult.value);
} else {
  console.error("Error:", successResult.error.message);
}
```

You can check if a result is an error using the `isErr` function:

```typescript
if (isErr(errorResult)) {
  console.error("Error:", errorResult.error.message);
} else {
  console.log("Success:", errorResult.value);
}
```

### Unwrapping Result

You can unwrap the value from a result type using `unwrapOr`, this will return the value if the result is successful or a default value if it's an error:

```typescript
const resultOne = ok(42);
const value = unwrapOr(resultOne, 12); // 42

const resultTwo = err("Something went wrong");
const value = unwrapOr(resultTwo, 12); // 12 default value
```

You can also unwrap the value from a successful result using `unwrap`, which throws an error for an error result:

> [!WARNING]
> This will throw an error if the result is an error, so make sure to handle it properly.

```typescript
const resultOne = ok(42);
const value = unwrap(resultOne); // 42

const resultTwo = err("Something went wrong");
const value = unwrap(resultTwo); // throws an error
```

### Transforming Result

You can apply a function to the value inside a successful result using `map`:

```typescript
const successResult = ok(42);
const mappedResult = map(successResult, (value) => value * 2);
// { value: 84, error: null }
```


### Roadmap

- [ ] Typesafe error handling
- [ ] `pipe` function 


### Contributing

Contributions are welcome, feel free to open an issue or a pull request.🍀
