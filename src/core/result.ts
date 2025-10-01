/**
 * Represents a Result type that can either hold a value of type T or an error of type E.
 *
 * ⚠️ **TypeScript Limitation:**
 * When returning multiple different `err(...)` values from a function, TypeScript will infer a union of separate `Err<...>` types (e.g., `Ok<42> | Err<"A"> | Err<"B">`), not a merged `Err<"A" | "B">`.
 *
 * **Best Practice:**
 * If you want the error type to be a union (e.g., `Ok<42> | Err<"A" | "B">`), explicitly annotate your function's return type.
 *
 * @example
 * // Successful result with a number
 * const successResult: Result<number, string> = ok(42);
 *
 * // Error result with a custom error message
 * const errorResult: Result<number, string> = err("Something went wrong");
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * Represents a successful Result.
 * @example
 * // Successful result with a number
 * const successResult: Ok<number> = { value: 42, error: null };
 */
export type Ok<T> = { value: T; error: null };

/**
 * Represents an error Result.
 *
 * ⚠️ **TypeScript Limitation:**
 * When returning multiple different `err(...)` values from a function, TypeScript will infer a union of separate `Err<...>` types (e.g., `Ok<42> | Err<"A"> | Err<"B">`), not a merged `Err<"A" | "B">`.
 *
 * **Best Practice:**
 * If you want the error type to be a union (e.g., `Ok<42> | Err<"A" | "B">`), explicitly annotate your function's return type.
 *
 * @example
 * // Error result with a custom error message
 * const errorResult: Err<string> = { value: null, error: "Something went wrong" };
 */
export type Err<E> = { value: null; error: E };

/**
 * Creates a successful Result with the provided data.
 * @param data The value to be wrapped in a successful Result.
 * @returns A Result containing the provided data and null for the error.
 * @example
 * // Create a successful result with a string
 * const successResult: Result<string> = ok("Hello, World!");
 */
export const ok = <const T>(data: T): Ok<T> => ({ value: data, error: null });

/**
 * Creates an error Result with the provided error.
 *
 * ⚠️ **TypeScript Limitation:**
 * When returning multiple different `err(...)` values from a function, TypeScript will infer a union of separate `Err<...>` types (e.g., `Ok<42> | Err<"A"> | Err<"B">`), not a merged `Err<"A" | "B">`.
 *
 * **Best Practice:**
 * If you want the error type to be a union (e.g., `Ok<42> | Err<"A" | "B">`), explicitly annotate your function's return type.
 *
 * @param error The error to be wrapped in an error Result.
 * @returns A Result containing null for the value and the provided error.
 * @example
 * // Create an error result with a custom error message
 * const errorResult: Result<number, string> = err("Something went wrong");
 *
 * // Create an error result with an existing Error object
 * const errorResult2: Result<number, Error> = err(new Error("Another error"));
 */
export const err = <const E>(error: E): Err<E> => ({ value: null, error });

/**
 * Checks if a Result is successful.
 * @param result The Result to be checked.
 * @returns True if the Result is successful, false otherwise.
 * @example
 * // Check if a result is successful
 * if (isOk(successResult)) {
 *   // Handle successful result
 *   console.log("Success:", successResult.value);
 * } else {
 *   // Handle error result
 *   console.error("Error:", successResult.error?.message);
 * }
 */
export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> =>
  result.error === null;

/**
 * Checks if a Result is an error.
 * @param result The Result to be checked.
 * @returns True if the Result is an error, false otherwise.
 * @example
 * // Check if a result is an error
 * if (isErr(errorResult)) {
 *   // Handle error result
 *   console.error("Error:", errorResult.error?.message);
 * } else {
 *   // Handle successful result
 *   console.log("Success:", errorResult.value);
 * }
 */
export const isErr = <T, E>(result: Result<T, E>): result is Err<E> =>
  result.error !== null;

/**
 * Unwraps the value from a successful Result, or returns a default value for an error Result.
 * @param result The Result to be unwrapped.
 * @param defaultValue The value to be returned if the Result is an error.
 * @returns The value from the Result if successful, or the default value for an error.
 * @example
 * // Unwrap a successful result or provide a default value for an error result
 * const value = unwrapOr(successResult, 0);
 * // value: number = 42
 */
export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T =>
  isOk(result) ? result.value! : defaultValue;

/**
 * Unwraps the value from a successful Result, or throws an error for an error Result.
 * @param result The Result to be unwrapped.
 * @returns The value from the Result if successful, or throws an error for an error.
 * @example
 * // Unwrap a successful result or throw an error for an error result
 * const value = unwrap(successResult);
 * // value: number = 42
 *
 * // Throws an error
 * const value = unwrap(errorResult);
 * // Error: Something went wrong
 */
export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (isOk(result)) return result.value!;
  throw result.error;
};

/**
 * A higher function that wraps a function in a safe Result.
 * @param fn The function to be wrapped.
 * @returns A new function that returns a Result.
 * @example
 * // Create a safe function
 * const safeJsonParse = makeSafe(JSON.parse);
 * const result = safeJsonParse("{ invalid json }");
 * // result: { value: null, error: SyntaxError }
 */
export function makeSafe<Fn extends (...args: any[]) => any>(fn: Fn) {
  return (...args: Parameters<Fn>): Result<ReturnType<Fn>, unknown> => {
    try {
      return ok(fn(...args));
    } catch (e) {
      return err(e);
    }
  };
}
