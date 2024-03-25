import testServer from "../../utils/testServer.js";
import listRoutes from "../../routes/ListRoutes.js";

const request = testServer(listRoutes);

describe("ListRoutes", () => {
  beforeAll(async () => {
    await UserModel.destroy({ where: {} });
    await ListModel.destroy({ where: {} });
  });
  describe("[ routes / list / :user_id ]", () => {
    beforeAll(async () => {
      await UserModel.create({
        name: "test",
        email: "test@example.com",
        password: "test",
        id: 1,
      });
      await ListModel.create({ name: "test", user_id: 1 });
      await ListModel.create({ name: "test2", user_id: 1 });
      await ListModel.create({
        name: "test3",
        description: "test description",
        user_id: 1,
      });
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

  describe("[ routes / list / :id ]", () => {
    beforeAll(async () => {
      await UserModel.create({
        name: "test",
        email: "test@example.com",
        password: "test",
        id: 1,
      });
      await ListModel.create({ name: "test", user_id: 1, id: 1 });
    });
    it("should update desctiption of an existing list", async () => {
      // Arrage
      let update = { description: "test description" };
      // Act
      const { status, body } = await request.put("/list/1").send(update);
      // Assert
      expect(status).toEqual(200);
      expect(body.message).toEqual("List updated successfully");
      const list = await ListModel.findByPk(1);
      expect(list.name).toEqual("test");
      expect(list.description).toEqual("test description");
    });

    it("should update name of an existing list", async () => {
      // Arrage
      let update = { name: "test2" };
      // Act
      const { status, body } = await request.put("/list/1").send(update);
      // Assert
      expect(status).toEqual(200);
      expect(body.message).toEqual("List updated successfully");
      const list = await ListModel.findByPk(1);
      expect(list.name).toEqual("test2");
    });

    it("should NOT update list of an inexisting list", async () => {
      // Arrage
      let update = { name: "test3" };
      // Act
      const { status, body } = await request.put("/list/2").send(update);
      // Assert
      expect(status).toEqual(404);
      expect(body.message).toEqual("List not found");
    });

    it("should NOT update list with invalid data type fields", async () => {
      // Arrage
      let update = { name: true };
      // Act
      const { status, body } = await request.put("/list/1").send(update);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Invalid data type");
    });

    it("should NOT update list with invalid id", async () => {
      // Arrage
      let update = { name: true };
      // Act
      const { status, body } = await request.put("/list/uno").send(update);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Id is required");
    });

    it("should delete an existent list", async () => {
      // Arrage

      // Act
      const { status, body } = await request.delete("/list/1");
      // Assert
      expect(status).toEqual(200);
      expect(body.message).toEqual("List deleted successfully");
    });
    it("should NOT delete an inexistent list", async () => {
      // Arrage

      // Act
      const { status, body } = await request.delete("/list/2");
      // Assert
      expect(status).toEqual(404);
      expect(body.message).toEqual("List not found");
    });
    it("should NOT delete a list with incorrect id", async () => {
      // Arrage

      // Act
      const { status, body } = await request.delete("/list/dos");
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Id is required");
    });
    afterAll(async () => {
      await ListModel.destroy({ where: {} });
      await UserModel.destroy({ where: { id: 1 } });
    });
  });
  describe("[ routes / list ]", () => {
    beforeAll(async () => {
      await UserModel.create({
        name: "test",
        email: "test@example.com",
        password: "test",
        id: 1,
      });
    });
    it("should create a new list", async () => {
      // Arrage
      const list = {
        name: "test",
        description: "test description",
        user_id: 1,
      };
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
      const { status, body } = await request
        .post("/list")
        .send(dataInvalidList);
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
      const { status, body } = await request
        .post("/list")
        .send(dataInvalidList);
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
      const { status, body } = await request
        .post("/list")
        .send(invalidUserList);
      // Assert
      expect(status).toEqual(404);
      expect(body.message).toEqual("The user does not exist");
    });
    afterEach(async () => {
      await ListModel.destroy({ where: {} });
    });
  });
});
