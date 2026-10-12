let mockCounterDoc = { exists: false, data: () => ({}) };
const mockTransaction = {
  get: jest.fn(async () => mockCounterDoc),
  set: jest.fn(),
  update: jest.fn(),
};

jest.mock("../../config/firebase", () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => "counterRef"),
    })),
    runTransaction: jest.fn(async (cb) => cb(mockTransaction)),
  },
}));

const { generateChildId } = require("../../helpers/childId.helper");

describe("Child ID Generator (childId.helper.js)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize counter at 1000 and return DLV-1000 when counter document does not exist", async () => {
    mockCounterDoc = { exists: false, data: () => ({}) };

    const childId = await generateChildId();

    expect(childId).toBe("DLV-1000");
    expect(mockTransaction.set).toHaveBeenCalledWith(
      "counterRef",
      expect.objectContaining({ currentValue: 1000 }),
    );
  });

  it("should increment existing counter value and pad with zeros (e.g., DLV-1001, DLV-9999)", async () => {
    mockCounterDoc = { exists: true, data: () => ({ currentValue: 1042 }) };

    const childId = await generateChildId();

    expect(childId).toBe("DLV-1043");
    expect(mockTransaction.update).toHaveBeenCalledWith(
      "counterRef",
      expect.objectContaining({ currentValue: 1043 }),
    );
  });

  it("should seamlessly transition from 4-digit to 5+ digit IDs when reaching DLV-10000", async () => {
    mockCounterDoc = { exists: true, data: () => ({ currentValue: 9999 }) };

    const childId = await generateChildId();

    expect(childId).toBe("DLV-10000");
  });
});
