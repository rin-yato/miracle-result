# @ave/fuck-around

A minimal implementation of the Result type in TypeScript. Allowing you to handle success and error states in a more explicit and structured way.

### Installation

```bash
npm install @avearistov/fuck-around

yarn add @avearistov/fuck-around

pnpm add @avearistov/fuck-around

bun add @avearistov/fuck-around
```

### Docs

- [API](#api)
- [Creating a Result](#creating-a-result)
- [Checking Result Type](#checking-result-type)
- [Unwrapping Result](#unwrapping-result)
- [Transforming Result](#transforming-result)

### API

```ts
// A result is either successful or you find out what happens
type Result<T> = FuckedAround<T> | FoundOut;

// When you fuck around and it works
type FuckedAround<T> = { value: T; consequences: null };

// When you find out what happens
type FoundOut = { value: null; consequences: Error };
```

### Creating a Result

You can create a result using the fuckAround or findOut function:

```typescript
import { fuckAround, findOut } from "@justmiracle/result";

const successResult: Result<number> = fuckAround(42);
// { value: 42, consequences: null }

const errorResult: Result<number> = findOut(
  new Error("Found out the hard way")
);
// { value: null, consequences: Error }

// consequences can be anything, if it's not an Error it will be converted to one
const errorResult: Result<number> = findOut("Found out the hard way");
// { value: null, consequences: Error }
```

### Checking Result Type

You can check if a result worked using the didItWork function:

```typescript
if (didItWork(successResult)) {
  console.log("Nice!", successResult.value);
} else {
  console.error("Found out:", successResult.consequences.message);
}
```

You can check if a result is an error using the didYouFuckUp function:

```typescript
if (didYouFuckUp(errorResult)) {
  console.error("Found out:", errorResult.consequences.message);
} else {
  console.log("Nice!", errorResult.value);
}
```

### Unwrapping Result

You can unwrap the value from a result type using `unwrapOr`, this will return the value if the result worked or a default value if it's an error:

```typescript
const resultOne = fuckAround(42);
const value = unwrapOr(resultOne, 12); // 42

const resultTwo = findOut("Found out the hard way");
const value = unwrapOr(resultTwo, 12); // 12 default value
```

You can also unwrap the value from a successful result using `unwrap`, which throws an error for an error result:

> [!WARNING]
> This will throw an error if you fucked up, so make sure to handle it properly.

```typescript
const resultOne = fuckAround(42);
const value = unwrap(resultOne); // 42

const resultTwo = findOut("Found out the hard way");
const value = unwrap(resultTwo); // throws an error
```

### Transforming Result

You can apply a function to the value inside a successful result using `map`:

```typescript
const successResult = fuckAround(42);
const mappedResult = map(successResult, (value) => value * 2);
// { value: 84, consequences: null }
```

### Roadmap

- [ ] Typesafe error handling
- [ ] `pipe` function

### Contributing

Contributions are welcome, feel free to open an issue or a pull request.🍀

