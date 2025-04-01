/**
 * Represents a Result type that can either succeed or fuck around and find out
 */
export type Result<T> = FuckedAround<T> | FoundOut;

/**
 * Represents a successful Result (fucked around and it worked)
 */
export type FuckedAround<T> = { value: T; consequences: null };

/**
 * Represents what happens when you find out
 */
export type FoundOut = { value: null; consequences: Error };

/**
 * When you fuck around and it works out
 */
export const fuckAround = <T>(data: T): Result<T> => ({
  value: data,
  consequences: null,
});

/**
 * When you find out what happens
 */
export const findOut = (error: any): FoundOut =>
  error instanceof Error
    ? { value: null, consequences: error }
    : { value: null, consequences: new Error(error, { cause: error }) };

/**
 * Checks if you fucked around successfully
 */
export const didItWork = <T>(
  result: Result<T>
): result is { value: T; consequences: null } => result.consequences === null;

/**
 * Checks if you fucked up
 */
export const didYouFuckUp = <T>(
  result: Result<T>
): result is { value: null; consequences: Error } => result.consequences !== null;

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
export const unwrapOr = <T>(result: Result<T>, defaultValue: T): T =>
  didItWork(result) ? result.value! : defaultValue;

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
export const unwrap = <T>(result: Result<T>): T => {
  if (didItWork(result)) return result.value!;
  throw result.consequences;
};

/**
 * Applies a function to the value inside a successful Result.
 * @param result The Result to be transformed.
 * @param fn The function to apply to the value.
 * @returns A new Result with the transformed value or the original error.
 * @example
 * // Map the value inside a successful result
 * const mappedResult = map(successResult, (value) => value * 2);
 * // mappedResult: { value: 84, error: null }
 *
 * // Map the value inside an error result
 * const mappedErrorResult = map(errorResult, (value) => value * 2);
 * // mappedErrorResult: { value: null, error: Error }
 */
export const map = <T, U>(result: Result<T>, fn: (value: T) => U): Result<U> =>
  didItWork(result)
    ? fuckAround(fn(result.value!))
    : { value: null, consequences: result.consequences };

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
  return (...args: Parameters<Fn>): Result<ReturnType<Fn>> => {
    try {
      return fuckAround(fn(...args));
    } catch (e) {
      return findOut(e);
    }
  };
}

