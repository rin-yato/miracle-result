import { describe, expect, it } from "vitest";

import {
  findOut,
  didYouFuckUp,
  didItWork,
  makeSafe,
  map,
  fuckAround,
  type Result,
  unwrap,
  unwrapOr,
} from "./result";

describe("Result Type and Utility Functions", () => {
  it("should create a successful Result with the provided data", () => {
    const successResult: Result<number> = fuckAround(42);
    expect(successResult.value).toBe(42);
    expect(successResult.consequences).toBe(null);
  });

  it("should create an error Result with the provided error", () => {
    const errorResult: Result<number> = findOut("Something went wrong");
    expect(errorResult.value).toBe(null);
    expect(errorResult.consequences instanceof Error).toBe(true);
    expect(errorResult.consequences?.message).toBe("Something went wrong");
  });

  it("should return the error if it is an instance of Error", () => {
    class CustomError extends Error {
      public code: number;
      constructor(message: string, code: number) {
        super(message);
        this.code = code;
      }
    }

    const customError = new CustomError("Something went wrong", 500);
    const errorResult: Result<number> = findOut(customError);
    expect(errorResult.value).toBe(null);
    expect(errorResult.consequences).toBe(customError);
  });

  it("should check if a Result is successful", () => {
    const successResult: Result<number> = fuckAround(42);
    expect(didItWork(successResult)).toBe(true);

    const errorResult: Result<number> = findOut("Error");
    expect(didItWork(errorResult)).toBe(false);
  });

  it("should check if a Result is an error", () => {
    const successResult: Result<number> = fuckAround(42);
    expect(didYouFuckUp(successResult)).toBe(false);

    const errorResult: Result<number> = findOut("Error");
    expect(didYouFuckUp(errorResult)).toBe(true);
  });

  it("should unwrap the value from a successful Result or return a default value for an error Result", () => {
    const successResult: Result<number> = fuckAround(42);
    const value = unwrapOr(successResult, 0);
    expect(value).toBe(42);

    const errorResult: Result<number> = findOut("Error");
    const defaultValue = unwrapOr(errorResult, 0);
    expect(defaultValue).toBe(0);
  });

  it("should unwrap the value from a successful Result or throw an error for an error Result", () => {
    const successResult: Result<number> = fuckAround(42);
    const value = unwrap(successResult);
    expect(value).toBe(42);

    const errorResult: Result<number> = findOut("Error");
    expect(() => unwrap(errorResult)).toThrow("Error");
  });

  it("should apply a function to the value inside a successful Result", () => {
    const successResult: Result<number> = fuckAround(42);
    const mappedResult = map(successResult, (value) => value * 2);
    expect(mappedResult.value).toBe(84);
    expect(mappedResult.consequences).toBe(null);

    const errorResult: Result<number> = findOut("Error");
    // @ts-expect-error - errorResult is inferred directly as Err
    const mappedErrorResult = map(errorResult, (value) => value * 2);
    expect(mappedErrorResult.value).toBe(null);
    expect(mappedErrorResult.consequences instanceof Error).toBe(true);

    const testFunction = (value: boolean) =>
      value ? fuckAround(42) : findOut("Error");

    const testResult = map(testFunction(true), (value) => value * 2);
    expect(testResult.value).toBe(84);

    const textErrorResult = map(testFunction(false), (value) => value * 2);
    expect(textErrorResult.value).toBe(null);
  });

  it("should let you fuck around and find out", () => {
    const unsafeFunction = () => {
      const random = Math.random() * 10;
      if (random < 5) return "Everything's fine!";
      throw new Error("Fucked around and found out!");
    };

    const fafoFunction = makeSafe(unsafeFunction);

    for (let i = 0; i < 10; i++) {
      const result = fafoFunction();
      if (didItWork(result)) {
        expect(result.value).toBe("Everything's fine!");
      } else {
        expect(result.consequences.message).toBe(
          "Fucked around and found out!"
        );
      }
    }
  });
});

