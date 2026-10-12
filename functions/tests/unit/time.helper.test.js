const {
  normalizeNaiveISO,
  addMinutesToNaiveISO,
  minutesDiffNaiveISO,
} = require("../../helpers/time.helper");

describe("time.helper.js", () => {
  describe("normalizeNaiveISO", () => {
    it("normalizes a naive ISO string without seconds", () => {
      expect(normalizeNaiveISO("2026-10-20T09:00")).toBe(
        "2026-10-20T09:00:00",
      );
    });

    it("converts a Z-suffixed string to Israel time (DST / שעון קיץ)", () => {
      expect(normalizeNaiveISO("2026-10-20T06:00:00.000Z")).toBe(
        "2026-10-20T09:00:00",
      );
    });

    it("converts a Z-suffixed string to Israel time (standard / שעון חורף)", () => {
      expect(normalizeNaiveISO("2026-11-03T07:00:00.000Z")).toBe(
        "2026-11-03T09:00:00",
      );
    });
  });

  describe("addMinutesToNaiveISO", () => {
    it("keeps the clock time unchanged across a DST transition", () => {
      expect(
        addMinutesToNaiveISO("2026-10-20T09:00:00", 7 * 24 * 60),
      ).toBe("2026-10-27T09:00:00");
    });
  });

  describe("minutesDiffNaiveISO", () => {
    it("computes the difference in minutes between two naive ISO strings", () => {
      expect(
        minutesDiffNaiveISO("2026-10-20T10:30:00", "2026-10-20T09:00:00"),
      ).toBe(90);
    });
  });
});
