import Utils from './Utils';

describe("Utils", () => {
  it("Alpha Sorts Correctly", () => {
    const testMap = new Map();
    testMap.set("A", 1);
    testMap.set("Ba", 2);
    testMap.set("b", 2);
    testMap.set("C", 4);
    const sorted = Utils.alphSort([...testMap.entries()], 0);
    const keys = sorted.map(e => e[0]);
    expect(keys[0]).toBe("A");
    expect(keys[1]).toBe("b");
  })
  it("Rev Alpha Sorts Correctly", () => {
    const testMap = new Map();
    testMap.set("A", 1);
    testMap.set("Ba", 2);
    testMap.set("b", 2);
    testMap.set("C", 4);
    const sorted = Utils.alphSort([...testMap.entries()], 0, true);
    const keys = sorted.map(e => e[0]);
    expect(keys[3]).toBe("A");
    expect(keys[2]).toBe("b");
  })
})