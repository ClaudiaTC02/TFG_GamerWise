import testServer from "../utils/testServer.js";
import listRoutes from "../routes/ListRoutes.js";
import { UserModel, ListModel, syncModels } from "../models/index.js";

const request = testServer(listRoutes);

describe("[ routes / list / :user_id ]", () => {
  beforeAll(async () => {
    await syncModels();
    await UserModel.destroy({ where: {} });
    await ListModel.destroy({ where: {} });
    await UserModel.create({
      name: "test",
      email: "test@example.com",
      password: "test",
      id: 1
    });
    await ListModel.create({ name: "test", user_id: 1 });
    await ListModel.create({ name: "test2", user_id: 1 });
    await ListModel.create({ name: "test3", description: "test description", user_id: 1 });
  });

  it("should show all lists of the user", async () => {
    // Arrange

    // Act
    const { status, body } = await request.get("/list/1");
    // Assert
    expect(status).toEqual(200);
    expect(body.length).toEqual(3);
    expect(body[0].name).toEqual("test");
    expect(body[1].name).toEqual("test2");
    expect(body[2].name).toEqual("test3");
  });

  it("should NOT show lists of inexistent user", async () => {
    // Arrange

    // Act
    const { status, body } = await request.get("/list/2");
    // Assert
    expect(status).toEqual(404);
    expect(body.message).toEqual("User not found");
  });

  it("should NOT show lists with invalid format", async () => {
    // Arrange

    // Act
    const { status, body } = await request.get("/list/uno");
    // Assert
    expect(status).toEqual(400);
    expect(body.message).toEqual("User is required");
  });

  afterAll(async () => {
    await ListModel.destroy({ where: {} });
    await UserModel.destroy({ where: { id: 1 } });
  });
});
