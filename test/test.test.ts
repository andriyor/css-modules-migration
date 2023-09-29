import fs from "fs";

import { beforeAll, describe, it, expect } from "vitest"
  ;
import { getPairs, migrate } from "../src";

beforeAll(async () => {
  migrate("test/example/src", false);
});

describe("css migrate", () => {
  const pairs = getPairs("test/example/src", false);
  const pairsKeys = Object.keys(pairs);
  it.each(pairsKeys)(
    "module %s should be the same module",
    (actual, expected) => {
      const methodFile = fs.readFileSync(pairs[actual].tsx, "utf-8");
      const expectedMethodFile = fs.readFileSync(
        pairs[actual].tsx.replace("example", "example-output"),
        "utf-8"
      );
      expect(methodFile).toEqual(expectedMethodFile);
    }
  );
});
