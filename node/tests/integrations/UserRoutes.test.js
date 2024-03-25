import testServer from "../../utils/testServer.js";
import userRoutes from "../../routes/UserRoutes.js";
import { hashPassword } from "../../utils/userUtils.js";

const request = testServer(userRoutes);

describe("UserRoutes", () => {
  describe("[ routes / user ]", () => {
    it("should create a new user", async () => {
      // Arrage
      const user = {
        email: "test@test.com",
        name: "test",
        password: "Test12345678!",
      };
      // Act
      const { status, body } = await request.post("/user").send(user);
      // Assert
      expect(status).toEqual(201);
      console.log(body.message);
      expect(body.message).toEqual("User created successfully");
    });

    it("should not create a new user with invalid email format", async () => {
      // Arrage
      const userInvalidEmail = {
        email: "test@.com",
        name: "test",
        password: "Test12345678!",
      };
      // Act
      const { status, body } = await request
        .post("/user")
        .send(userInvalidEmail);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Invalid email format");
    });

    it("should not create a new user with incompleted fields", async () => {
      // Arrage
      const userIncomplete = { email: "test@.com", password: "Test12345678!" };
      // Act
      const { status, body } = await request.post("/user").send(userIncomplete);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Required fields");
    });

    it("should not create a new user with invalid data type", async () => {
      // Arrage
      const userInvalidType = {
        email: 1234,
        password: "Test12345678!",
        name: "test",
      };
      // Act
      const { status, body } = await request
        .post("/user")
        .send(userInvalidType);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Invalid data type");
    });

    it("should not create a new user with invalid password", async () => {
      // Arrage
      const userInvalidPass = {
        email: "test@test.com",
        name: "test",
        password: "test",
      };
      // Act
      const { status, body } = await request
        .post("/user")
        .send(userInvalidPass);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual(
        "Invalid password format, It must contain uppercase, lowercase, symbol and >= 8 length"
      );
    });

    it("should not create a new user with existing email", async () => {
      // Arrage
      const user1 = {
        email: "test@test.com",
        name: "test",
        password: "Test12345678!",
      };
      const user2 = {
        email: "test@test.com",
        name: "user",
        password: "Test12345678!",
      };
      await UserModel.create(user1);
      // Act
      const { status, body } = await request.post("/user").send(user2);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Email already exists");
    });

    it("should not create a new user with empty name", async () => {
      // Arrage
      const userEmptyName = {
        email: "test@test.com",
        name: "",
        password: "Test12345678!",
      };
      // Act
      const { status, body } = await request.post("/user").send(userEmptyName);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Required fields");
    });

    // destroy all items
    afterEach(async () => {
      await UserModel.destroy({ where: {} });
    });
  });

  describe("[routes / user/ login ]", () => {
    beforeAll(async () => {
      const hashedPassword = await hashPassword("Password123?");
      await UserModel.create({
        name: "Claudia",
        password: hashedPassword,
        email: "claudia@gmail.com",
      });
    });
    it("should login a user with valid credentials", async () => {
      // Arrage
      const l_validUser = {
        email: "claudia@gmail.com",
        password: "Password123?",
      };
      // Act
      const { status, body } = await request
        .post("/user/login")
        .send(l_validUser);
      // Assert
      expect(status).toEqual(200);
      expect(body.token).toBeDefined();
    });

    it("should NOT login a user with invalid email", async () => {
      // Arrage
      const l_Invaliduser = {
        email: "tester@gmail.com",
        password: "Password123?",
      };
      // Act
      const { status, body } = await request
        .post("/user/login")
        .send(l_Invaliduser);
      // Assert
      expect(status).toEqual(404);
      expect(body.message).toEqual("User not found or incorrect password");
    });

    it("should NOT login a user with invalid password", async () => {
      // Arrage
      const l_user = { email: "claudia@gmail.com", password: "Password3?" };
      // Act
      const { status, body } = await request.post("/user/login").send(l_user);
      // Assert
      expect(status).toEqual(404);
      expect(body.message).toEqual("User not found or incorrect password");
    });

    it("should NOT login a user with incompleted fields", async () => {
      // Arrage
      const l_Incompleteuser = { password: "Password3?" };
      // Act
      const { status, body } = await request
        .post("/user/login")
        .send(l_Incompleteuser);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Required fields");
    });

    it("should NOT login a user with invalid data types", async () => {
      // Arrage
      const l_InvalidDatauser = { email: "claudia@gmail.com", password: 123 };
      // Act
      const { status, body } = await request
        .post("/user/login")
        .send(l_InvalidDatauser);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Invalid data type");
    });

    it("should NOT login a user with invalid email format", async () => {
      // Arrage
      const l_InvalidEmailuser = {
        email: "@gmail.com",
        password: "Password123?",
      };
      // Act
      const { status, body } = await request
        .post("/user/login")
        .send(l_InvalidEmailuser);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Invalid email format");
    });

    afterAll(async () => {
      await UserModel.destroy({ where: {} });
    });
  });
});
