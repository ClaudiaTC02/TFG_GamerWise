import testServer from "../utils/testServer.js";
import listRoutes from "../routes/ListRoutes.js";

const request = testServer(listRoutes);

describe("[ routes / list / :id ]", () => {
    beforeAll(async () => {
        await UserModel.destroy({ where: {} });
        await ListModel.destroy({ where: {} });
        await UserModel.create({
          name: "test",
          email: "test@example.com",
          password: "test",
          id: 1
        });
        await ListModel.create(
          { name: "test", user_id: 1, id:1}
        );
    });

    it("should update desctiption of a existing list", async () => {
        // Arrage
        let update = {description: "test description"}
        // Act
        const { status, body } = await request.put("/list/1").send(update);
        // Assert
        expect(status).toEqual(200);
        expect(body.message).toEqual("List updated successfully");
        const list = await ListModel.findByPk(1)
        expect(list.name).toEqual("test")
        expect(list.description).toEqual("test description")
    });

    it("should update name of a existing list", async () => {
        // Arrage
        let update = {name: "test2"}
        // Act
        const { status, body } = await request.put("/list/1").send(update);
        // Assert
        expect(status).toEqual(200);
        expect(body.message).toEqual("List updated successfully");
        const list = await ListModel.findByPk(1)
        expect(list.name).toEqual("test2")
    });

    
    it("should NOT update list of a inexisting list", async () => {
        // Arrage
        let update = {name: "test3"}
        // Act
        const { status, body } = await request.put("/list/2").send(update);
        // Assert
        expect(status).toEqual(404);
        expect(body.message).toEqual("List not found");
    });

    it("should NOT update list with invalid data type fields", async () => {
        // Arrage
        let update = {name: true}
        // Act
        const { status, body } = await request.put("/list/1").send(update);
        // Assert
        expect(status).toEqual(400);
        expect(body.message).toEqual("Invalid data type");
    });

    afterAll(async () => {
        await ListModel.destroy({ where: {} });
        await UserModel.destroy({ where: { id: 1 } });
      });
})