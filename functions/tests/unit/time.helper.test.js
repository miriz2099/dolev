const {
  normalizeNaiveISO,
  addMinutesToNaiveISO,
  minutesDiffNaiveISO,
} = require("../../helpers/time.helper");

describe("Time Helper (time.helper.js) - Timezone-Resilient Scheduling", () => {
  describe("normalizeNaiveISO", () => {
    it("should normalize a naive ISO string without seconds to HH:mm:ss", () => {
      expect(normalizeNaiveISO("2026-10-20T09:00")).toBe("2026-10-20T09:00:00");
    });

    it("should convert UTC string in Israel Daylight Time (Summer) to local naive ISO", () => {
      // 06:00 UTC = 09:00 Israel Time (UTC+3)
      expect(normalizeNaiveISO("2026-10-20T06:00:00.000Z")).toBe(
        "2026-10-20T09:00:00",
      );
    });

    it("should convert UTC string in Israel Standard Time (Winter) to local naive ISO", () => {
      // 07:00 UTC = 09:00 Israel Time (UTC+2)
      expect(normalizeNaiveISO("2026-11-03T07:00:00.000Z")).toBe(
        "2026-11-03T09:00:00",
      );
    });
  });

  describe("addMinutesToNaiveISO", () => {
    it("should add minutes across the daylight saving transition without shifting the time of day", () => {
      // Crossing DST transition in late October, adding exactly 7 days
      const result = addMinutesToNaiveISO("2026-10-20T09:00:00", 7 * 24 * 60);
      expect(result).toBe("2026-10-27T09:00:00");
    });
  });

  describe("minutesDiffNaiveISO", () => {
    it("should calculate exact minute difference between two naive ISO timestamps", () => {
      expect(
        minutesDiffNaiveISO("2026-10-20T10:30:00", "2026-10-20T09:00:00"),
      ).toBe(90);
    });
  });
});
