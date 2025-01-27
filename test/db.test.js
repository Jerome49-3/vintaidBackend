const mongoose = require("mongoose");

describe("Mongoose Connection", () => {
  const testDbUri = MONGODB_URI;

  beforeAll(async () => {
    try {
      await mongoose.connect(testDbUri);
      console.log("Connected to test database");
    } catch (error) {
      console.error("Error connecting to test database", error);
    }
  });

  afterAll(async () => {
    try {
      await mongoose.connection.close();
      console.log("Disconnected from test database");
    } catch (error) {
      console.error("Error disconnecting from test database", error);
    }
  });

  test("should connect to the database", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
