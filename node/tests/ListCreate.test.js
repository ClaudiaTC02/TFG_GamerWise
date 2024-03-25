import testServer from "../utils/testServer.js";
import listRoutes from "../routes/ListRoutes.js";

const request = testServer(listRoutes);

describe("[ routes / list ]", () => {
  beforeAll(async () => {
    await UserModel.destroy({ where: {} });
    await ListModel.destroy({ where: {} });
    await UserModel.create({
      name: "test",
      email: "test@example.com",
      password: "test",
      id: 1
    });
  });

  it("should create a new list", async () => {
    // Arrage
    const list = { name: "test", description: "test description", user_id: 1 };
    // Act
    const { status, body } = await request.post("/list").send(list);
    // Assert
    expect(status).toEqual(201);
    expect(body.message).toEqual("List created successfully");
    expect(body.list.name).toEqual("test");
    expect(body.list.description).toEqual("test description");
  });

  it("should create a new list with no description", async () => {
    // Arrage
    const noDescriptionList = { name: "test", user_id: 1 };
    // Act
    const { status, body } = await request
      .post("/list")
      .send(noDescriptionList);
    // Assert
    expect(status).toEqual(201);
    expect(body.message).toEqual("List created successfully");
    expect(body.list.name).toEqual("test");
    expect(body.list.description).toEqual("null");
  });

  it("should NOT create a new list with no name", async () => {
    // Arrage
    const incompleteList = { description: "test description", user_id: 1 };
    // Act
    const { status, body } = await request.post("/list").send(incompleteList);
    // Assert
    expect(status).toEqual(400);
    expect(body.message).toEqual("Name and user_id are required");
  });

  it("should NOT create a new list with invalid name data type", async () => {
    // Arrage
    const dataInvalidList = {
      name: 1,
      description: "test description",
      user_id: 1,
    };
    // Act
    const { status, body } = await request.post("/list").send(dataInvalidList);
    // Assert
    expect(status).toEqual(400);
    expect(body.message).toEqual("Invalid data type");
  });

  it("should NOT create a new list with invalid id data type", async () => {
    // Arrage
    const dataInvalidList = {
      name: "test",
      description: "test description",
      user_id: "1",
    };
    // Act
    const { status, body } = await request.post("/list").send(dataInvalidList);
    // Assert
    expect(status).toEqual(400);
    expect(body.message).toEqual("Invalid data type");
  });

  it("should NOT create a new list with inexistent user", async () => {
    // Arrage
    const invalidUserList = {
      name: "test",
      description: "test description",
      user_id: 2,
    };
    // Act
    const { status, body } = await request.post("/list").send(invalidUserList);
    // Assert
    expect(status).toEqual(404);
    expect(body.message).toEqual("The user does not exist");
  });

  afterEach(async () => {
    await ListModel.destroy({ where: {} });
  });
  afterAll(async () => {
    await UserModel.destroy({ where: { id: 1 } });
  });
});