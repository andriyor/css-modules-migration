import fs from 'fs';

import { beforeAll, describe, it, expect } from 'vitest'
import { migrate } from "../src";


beforeAll(async () => {
  migrate('example/src', false);
});

describe('css migrate', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(3).toBe(3);
  });
});
