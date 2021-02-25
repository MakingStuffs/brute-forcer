/**
 * @jest-environment node
 */

const pdfTools = require("./pdfTools");

describe("pdfTools.checkPassword", () => {
  const filePath = "./input/test.pdf";
  test("can open with correct password", async () => {
    const response = await pdfTools.checkPassword(filePath, "test");
    expect(response).toBeDefined();
    expect(response.passwordFound).toBe(true);
    expect(response.message).toBe("Password found!");
    expect(response.filePath).toBe(filePath);
    expect(response.passwordAttempted).toBe("test");
  });

  test("fails with incorrect password", async () => {
    const response = await pdfTools.checkPassword(filePath, "wrong");
    expect(response).toBeDefined();
    expect(response.passwordFound).toBe(false);
    expect(response.message).toBe("Incorrect Password");
    expect(response.filePath).toBe(filePath);
    expect(response.passwordAttempted).toBe("wrong");
  });
});
