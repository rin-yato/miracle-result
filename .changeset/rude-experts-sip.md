---
"@avearistov/fuck-around": major
---

BREAKING CHANGES: Complete API overhaul to "fuck around and find out" pattern

- Renamed `ok` to `fuckAround`
- Renamed `err` to `findOut`
- Renamed `isOk` to `didItWork`
- Renamed `isErr` to `didYouFuckUp`
- Renamed `error` field to `consequences`
- Updated types to `FuckedAround` and `FoundOut`
- Updated documentation to reflect new naming

Migration Guide:

- Replace all `ok(value)` with `fuckAround(value)`
- Replace all `err(error)` with `findOut(error)`
- Replace all `isOk(result)` with `didItWork(result)`
- Replace all `isErr(result)` with `didYouFuckUp(result)`
- Update type references from `Ok/Err` to `FuckedAround/FoundOut`
- Update error field references to consequences

