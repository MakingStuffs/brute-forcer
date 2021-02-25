/**
 * @jest-environment node
 */
const fs = require("fs");
const mutationTools = require("./permutationTools");
const data = require("../data/testData.json");

describe("mutationTools.getMutations", () => {
  test("returns correct mutations", () => {
    const response = mutationTools.getMutations("test", data.substitutions);
    const expectedResponses = data.testMutations;
    expect(response).toHaveLength(12);
    response.forEach((entry) =>
      expect(expectedResponses.includes(entry)).toBe(true)
    );
  });
});

describe("mutationTools.mutateMany", () => {
  test("returns correct mutatations", () => {
    const response = mutationTools.mutateMany(
      ["bags", "test"],
      data.substitutions
    );
    expect(response).toHaveLength(data.mutateManyResults.length);
    response.forEach((word) =>
      expect(data.mutateManyResults.includes(word)).toBe(true)
    );
  });
});

describe("mutationTools.getXcombos", () => {
  test("returns two word combos", () => {
    const words = data.testMutations;
    const expectedResponseLength =
      data.setsOfTwo.length + data.testMutations.length;
    const response = mutationTools.getXcombos(words, 2);
    expect(response.length).toBe(expectedResponseLength);
  });
  test("returns three word combos", () => {
    const words = data.testMutations;
    const expectedResponseLength =
      data.setsOfThree.length +
      data.setsOfTwo.length +
      data.testMutations.length;
    const response = mutationTools.getXcombos(words, 3);
    expect(response.length).toBe(expectedResponseLength);
  });
});

describe("mutationTools.writePermutationsToDisc", () => {
  test("expect file to be created", () => {
    mutationTools.writePermutationsToDisc(
      "test",
      data.substitutions,
      "./output/mutations"
    );
    const exists = fs.existsSync(
      `./output/mutations/test-${new Date().toISOString().split("T")[0]}.json`
    );
    expect(exists).toBe(true);
  });

  test("expect file to have correct number of entries", () => {
    mutationTools.writePermutationsToDisc(
      "test",
      data.substitutions,
      "./output/mutations"
    );
    const rawData = fs.readFileSync(
      `./output/mutations/test-${new Date().toISOString().split("T")[0]}.json`,
      "utf8"
    );
    const writtenData = JSON.parse(rawData);
    expect(writtenData.mutatedWords).toHaveLength(data.testMutations.length);
  });

  test("expect file to have correct entries", () => {
    mutationTools.writePermutationsToDisc(
      "test",
      data.substitutions,
      "./output/mutations"
    );
    const rawData = fs.readFileSync(
      `./output/mutations/test-${new Date().toISOString().split("T")[0]}.json`,
      "utf8"
    );
    const writtenData = JSON.parse(rawData);
    writtenData.mutatedWords.forEach((word) =>
      expect(data.testMutations.includes(word)).toBe(true)
    );
  });
});

describe("mutationTools.writePaswordCombosToDisk", () => {
  test("expect file to be created", () => {
    mutationTools.writePaswordCombosToDisk(
      data.testMutations,
      2,
      "./output/combinations"
    );
    const exists = fs.existsSync(
      `./output/combinations/${new Date().toISOString().split("T")[0]}.json`
    );
    expect(exists).toBe(true);
  });

  test("expect file to have correct number of entries", () => {
    mutationTools.writePaswordCombosToDisk(
      data.testMutations,
      2,
      "./output/combinations"
    );
    const rawData = fs.readFileSync(
      `./output/combinations/${new Date().toISOString().split("T")[0]}.json`,
      "utf8"
    );
    const writtenData = JSON.parse(rawData);
    expect(writtenData.passwordCombos).toHaveLength(
      data.setsOfTwo.length + data.testMutations.length
    );
  });

  test("expect file to have correct entries", () => {
    mutationTools.writePaswordCombosToDisk(
      data.testMutations,
      2,
      "./output/combinations"
    );
    const rawData = fs.readFileSync(
      `./output/combinations/${new Date().toISOString().split("T")[0]}.json`,
      "utf8"
    );
    const writtenData = JSON.parse(rawData);
    writtenData.passwordCombos.forEach((word) =>
      expect([...data.testMutations, ...data.setsOfTwo].includes(word)).toBe(
        true
      )
    );
  });
});
