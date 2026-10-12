const {
  isValidSignatureImage,
  SIGNATURE_IMAGE_RE,
} = require("../../helpers/signature.helper");

describe("Signature Helper (signature.helper.js)", () => {
  it("should accept valid PNG and JPEG base64 data URLs", () => {
    const validPng =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const validJpeg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBD";

    expect(isValidSignatureImage(validPng)).toBe(true);
    expect(isValidSignatureImage(validJpeg)).toBe(true);
  });

  it("should reject disallowed mime types such as SVG and HTML", () => {
    expect(
      isValidSignatureImage(
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==",
      ),
    ).toBe(false);
    expect(
      isValidSignatureImage("data:text/html;base64,PGgxPkhlbGxvPC9oMT4="),
    ).toBe(false);
  });

  it("should reject empty strings, non-strings, and base64 payloads with invalid characters", () => {
    expect(isValidSignatureImage("")).toBe(false);
    expect(isValidSignatureImage(null)).toBe(false);
    expect(isValidSignatureImage(12345)).toBe(false);
    // Base64 containing illegal characters like spaces or symbols
    expect(
      isValidSignatureImage("data:image/png;base64,invalid characters here!"),
    ).toBe(false);
  });

  it("should reject signatures exceeding maximum allowed length (100,000 chars)", () => {
    const hugeSignature =
      "data:image/png;base64," + "A".repeat(100005) + "==";
    expect(isValidSignatureImage(hugeSignature)).toBe(false);
  });
});
