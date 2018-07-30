import Utils from './Utils';

describe("Utils", () => {
  it("Alpha sorts map", () => {
    const testMap = new Map();
    testMap.set("C", 4);
    testMap.set("A", 1);
    testMap.set("b", 2);
    testMap.set("Ba", 2);
    const sorted = Utils.alphSort([...testMap.entries()], 0);
    const keys = sorted.map(e => e[0]);
    expect(keys[0]).toBe("A");
    expect(keys[1]).toBe("b");
  })
  it("Rev alpha sorts map", () => {
    const testMap = new Map();
    testMap.set("C", 4);
    testMap.set("A", 1);
    testMap.set("b", 2);
    testMap.set("Ba", 2);
    const sorted = Utils.alphSort([...testMap.entries()], 0, true);
    const keys = sorted.map(e => e[0]);
    expect(keys[3]).toBe("A");
    expect(keys[2]).toBe("b");
  })
  it("Alpha sorts array", () => {
    const arr = ["A", "C", "b", "Ba"];
    const sorted = Utils.alphSort(arr);
    expect(sorted[0]).toBe("A");
    expect(sorted[2]).toBe("Ba");
  })
  it("Number sorts map", () => {
    const testMap = new Map();
    testMap.set("C", 4);
    testMap.set("l", 1);
    testMap.set("b", 2);
    testMap.set("x", 2);
    const sorted = Utils.numSort([...testMap.entries()], 1);
    const keys = sorted.map(e => e[0]);
    expect(keys[0]).toBe("C");
    expect(keys[3]).toBe("l");
  })
  it("Rev number sorts map", () => {
    const testMap = new Map();
    testMap.set("C", 4);
    testMap.set("l", 1);
    testMap.set("b", 2);
    testMap.set("x", 2);
    const sorted = Utils.numSort([...testMap.entries()], 1, true);
    const keys = sorted.map(e => e[0]);
    expect(keys[0]).toBe("l");
    expect(keys[3]).toBe("C");
  })
  it("Number sorts array", () => {
    const arr = [5, 2, -1, 7];
    const sorted = Utils.numSort(arr);
    expect(sorted[0]).toBe(7);
    expect(sorted[2]).toBe(2);
  })
  it("Randomizes an array", () =>{
    const arr = [1,2,3,4,5,6,7];
    const shufArr = Utils.shuffleArr(arr);
    expect(shufArr.length).toBe(arr.length);
    expect(shufArr).toContain(1);
    expect(shufArr).toContain(5);
  });
  it("Formats a S123 string", () => {
    const cases = [
      ["ac_dc", "ac dc"],
      ["Ac Dc", "Ac Dc"],
      ["aC,dC", "aC, dC"]
    ];
    for(let c of cases){
      const output = Utils.formatSurveyStr(c[0]);
      expect(output).toBe(c[1]);
    }
  });
  it("Trims a string", () => {
    //Rick & Morty lighthouse tale
    let str = "Fade in. Exterior. Unnamed city. Day. The hustle and bustle is a symphony of progress. We pan past windows, each of which contain a different story, to find Jacey Lakims, 28, hot, but doesn't know it. Jacey stops when her high heel gets caught in the grating of a sewer. Suddenly a man steps into frame and points a gun at her. This is not her day. Fade to black. Title -- 'Three weeks earlier.'"
    let trimStr = Utils.trimString(str, 20);
    expect(trimStr).toBe("Fade in. Exterior...")
  });
})