const mockVerifyIdToken = jest.fn();
const mockDocGet = jest.fn();
const mockDoc = jest.fn(() => ({ get: mockDocGet }));
const mockCollection = jest.fn(() => ({ doc: mockDoc }));

jest.mock("../../config/firebase", () => ({
  auth: {
    verifyIdToken: mockVerifyIdToken,
  },
  db: {
    collection: mockCollection,
  },
}));

const { verifyToken, verifyAdmin } = require("../../middleware/auth.middleware");

describe("Authentication & RBAC Middleware (auth.middleware.js)", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe("verifyToken", () => {
    it("should return 401 when authorization header is missing", async () => {
      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when authorization header does not start with 'Bearer '", async () => {
      req.headers.authorization = "Basic some_token";

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when token verification fails or expires", async () => {
      req.headers.authorization = "Bearer invalid_expired_token";
      mockVerifyIdToken.mockRejectedValue(new Error("Token has expired"));

      // Suppress console.error in test output
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid or expired token" });
      expect(next).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should attach decoded user to req and call next when token is valid", async () => {
      req.headers.authorization = "Bearer valid_jwt_token";
      const decodedUser = { uid: "user123", email: "user@example.com" };
      mockVerifyIdToken.mockResolvedValue(decodedUser);

      await verifyToken(req, res, next);

      expect(mockVerifyIdToken).toHaveBeenCalledWith("valid_jwt_token");
      expect(req.user).toEqual(decodedUser);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("verifyAdmin", () => {
    it("should return 401 when authorization header is missing", async () => {
      await verifyAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 when user exists but is NOT an admin", async () => {
      req.headers.authorization = "Bearer valid_token";
      mockVerifyIdToken.mockResolvedValue({ uid: "parent_uid_456" });
      mockDocGet.mockResolvedValue({
        data: () => ({ role: "patient", firstName: "Israel" }),
      });

      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

      await verifyAdmin(req, res, next);

      expect(mockCollection).toHaveBeenCalledWith("users");
      expect(mockDoc).toHaveBeenCalledWith("parent_uid_456");
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Access denied. Admins only.",
      });
      expect(next).not.toHaveBeenCalled();

      warnSpy.mockRestore();
    });

    it("should allow access and call next when user role is admin", async () => {
      req.headers.authorization = "Bearer admin_token";
      const adminDecoded = { uid: "admin_uid_789" };
      mockVerifyIdToken.mockResolvedValue(adminDecoded);
      mockDocGet.mockResolvedValue({
        data: () => ({ role: "admin", firstName: "SuperAdmin" }),
      });

      await verifyAdmin(req, res, next);

      expect(req.user).toEqual(adminDecoded);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
