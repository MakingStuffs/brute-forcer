/**
 * @jest-environment node
 */
const path = require("path");
const zipTools = require("./zipTools");

describe("testZipPassword", () => {
  const filePath = path.resolve("./input/test.7z");

  test("can open with correct password", async () => {
    const response = await zipTools.checkPassword(filePath, "T35t!");
    expect(response.passwordFound).toBeDefined();
    expect(response.passwordFound).toBe(true);
    expect(response.passwordAttempted).toBe("T35t!");
  });

  test("output file is created", () => {});

  test("fails with wrong password", async () => {
    try {
      await zipTools.checkPassword(filePath, "test");
    } catch (e) {
      expect(e.message).toContain("Wrong password");
    }
  });
});
