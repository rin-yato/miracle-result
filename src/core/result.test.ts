import { describe, expect, it } from 'vitest';

import { err, isErr, isOk, map, ok, Result, unwrap, unwrapOr } from './result';

describe('Result Type and Utility Functions', () => {
  it('should create a successful Result with the provided data', () => {
    const successResult: Result<number> = ok(42);
    expect(successResult.value).toBe(42);
    expect(successResult.error).toBe(null);
  });

  it('should create an error Result with the provided error', () => {
    const errorResult: Result<number> = err('Something went wrong');
    expect(errorResult.value).toBe(null);
    expect(errorResult.error instanceof Error).toBe(true);
    expect(errorResult.error?.message).toBe('Something went wrong');
  });

  it('should check if a Result is successful', () => {
    const successResult: Result<number> = ok(42);
    expect(isOk(successResult)).toBe(true);

    const errorResult: Result<number> = err('Error');
    expect(isOk(errorResult)).toBe(false);
  });

  it('should check if a Result is an error', () => {
    const successResult: Result<number> = ok(42);
    expect(isErr(successResult)).toBe(false);

    const errorResult: Result<number> = err('Error');
    expect(isErr(errorResult)).toBe(true);
  });

  it('should unwrap the value from a successful Result or return a default value for an error Result', () => {
    const successResult: Result<number> = ok(42);
    const value = unwrapOr(successResult, 0);
    expect(value).toBe(42);

    const errorResult: Result<number> = err('Error');
    const defaultValue = unwrapOr(errorResult, 0);
    expect(defaultValue).toBe(0);
  });

  it('should unwrap the value from a successful Result or throw an error for an error Result', () => {
    const successResult: Result<number> = ok(42);
    const value = unwrap(successResult);
    expect(value).toBe(42);

    const errorResult: Result<number> = err('Error');
    expect(() => unwrap(errorResult)).toThrow('Error');
  });

  it('should apply a function to the value inside a successful Result', () => {
    const successResult: Result<number> = ok(42);
    const mappedResult = map(successResult, value => value * 2);
    expect(mappedResult.value).toBe(84);
    expect(mappedResult.error).toBe(null);

    const errorResult: Result<number> = err('Error');
    // @ts-expect-error - errorResult is inferred directly as Err
    const mappedErrorResult = map(errorResult, value => value * 2);
    expect(mappedErrorResult.value).toBe(null);
    expect(mappedErrorResult.error instanceof Error).toBe(true);

    const testFunction = (value: boolean) => value ? ok(42) : err('Error');

    const testResult = map(testFunction(true), value => value * 2);
    expect(testResult.value).toBe(84);

    const textErrorResult = map(testFunction(false), value => value * 2);
    expect(textErrorResult.value).toBe(null);
  });
});
