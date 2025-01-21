import request from "supertest";
import app from "../index"; // Import your Express app
import { statusCode } from "../src/config/constants";

describe("GROCERY BOOKING RESTAPIs Tests", () => {
  describe("User RestAPIs Tests", () => {
    describe("GET /api/v1/users/ - Get Users", () => {
      it("should fetch a list of users and return 200 status", async () => {
        const response = await request(app).get(`/api/v1/users/`);

        expect(response.status).toBe(statusCode.OK);
        expect(response.body.data).toBeInstanceOf(Array);
      });
    });
  });
  describe("Grocery RestAPIs Tests", () => {
    let groceryId: string;
    const userId = 1;

    describe("POST /api/v1/grocery - Create Grocery Item", () => {
      it("should create a new grocery item and return 201 status  (accessing by admin role)", async () => {
        const groceryData = {
          user_id: userId,
          name: "Sample Grocery Item",
          price: 10,
          quantity: 100,
          category: "snacks",
        };

        const response = await request(app)
          .post("/api/v1/grocery")
          .send(groceryData)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(statusCode.CREATED);
        expect(response.body.data[0]).toHaveProperty("id");
        expect(response.body.data[0].name).toBe(groceryData.name);
        expect(response.body.data[0].quantity).toBe(groceryData.quantity);

        // Store groceryId for later tests
        groceryId = response.body.data[0].id;
      });

      it("should not create a new grocery item and return 401 status (accessing by user role)", async () => {
        const groceryData = {
          user_id: 2,
          name: "Sample Grocery Item",
          price: 10,
          quantity: 100,
          category: "snacks",
        };

        const response = await request(app)
          .post("/api/v1/grocery")
          .send(groceryData)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(statusCode.UNAUTHORIZED);
      });

      it("should not create a new grocery item and return 422 status (invalid request data)", async () => {
        const groceryData = {
          user_id: userId,
          name: "Sample Grocery Item",
          price: "invalid",
          quantity: 100,
          category: "snacks",
        };

        const response = await request(app)
          .post("/api/v1/grocery")
          .send(groceryData)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(statusCode.UNPROCESSABLE_ENTITY);
      });
    });

    describe("GET /api/v1/grocery/:id - Get Grocery Item", () => {
      it("should fetch a grocery item by ID and return 200 status", async () => {
        const response = await request(app).get(`/api/v1/grocery/${groceryId}`);

        expect(response.status).toBe(statusCode.OK);
        expect(response.body.data[0]).toHaveProperty("id", groceryId);
        expect(response.body.data[0]).toHaveProperty("name");
        expect(response.body.data[0]).toHaveProperty("category");
      });

      it("should not fetch a grocery item by ID and return 404 status (invalid ID)", async () => {
        const response = await request(app).get(`/api/v1/grocerys/`);

        expect(response.status).toBe(statusCode.NOT_FOUND);
      });
    });

    describe("PATCH /api/v1/grocery/:id - Update Grocery Item", () => {
      it("should update the grocery item and return 200 status", async () => {
        const updateData = {
          user_id: userId,
          name: "Updated Grocery Item",
          price: 12.99,
          quantity: 150,
          category: "beverages",
        };

        const response = await request(app)
          .patch(`/api/v1/grocery/${groceryId}`)
          .send(updateData)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(statusCode.OK);
      });

      it("should not update the grocery item and return 401 status (accessing by user role)", async () => {
        const updateData = {
          user_id: 2,
          name: "Updated Grocery Item",
          price: 12.99,
          quantity: 150,
          category: "beverages",
        };

        const response = await request(app)
          .patch(`/api/v1/grocery/${groceryId}`)
          .send(updateData)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(statusCode.UNAUTHORIZED);
      });

      it("should not update the grocery item and return 400 status (invalid request data)", async () => {
        const updateData = {
          user_id: userId,
          name: "Updated Grocery Item",
          price: "invalid",
          quantity: 150,
          category: "beverages",
        };

        const response = await request(app)
          .patch(`/api/v1/grocery/${groceryId}`)
          .send(updateData)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(statusCode.UNPROCESSABLE_ENTITY);
      });
    });

    describe("PUT /api/v1/grocery/inventory/:id - Update Grocery Item Inventory", () => {
      it("should update the grocery item inventory and return 200 status", async () => {
        const updateData = {
          user_id: userId,
          quantity: 200,
        };

        const response = await request(app)
          .put(`/api/v1/grocery/inventory/${groceryId}/`)
          .send(updateData)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(statusCode.OK);
      });

      it("should not update the grocery item inventory and return 401 status (accessing by user role)", async () => {
        const updateData = {
          user_id: 2,
          quantity: 200,
        };

        const response = await request(app)
          .put(`/api/v1/grocery/inventory/${groceryId}/`)
          .send(updateData)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(statusCode.UNAUTHORIZED);
      });

      it("should not update the grocery item inventory and return 400 status (invalid request data)", async () => {
        const updateData = {
          user_id: userId,
          quantity: "invalid",
        };

        const response = await request(app)
          .put(`/api/v1/grocery/inventory/${groceryId}/`)
          .send(updateData)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(statusCode.UNPROCESSABLE_ENTITY);
      });
    });

    describe("DELETE /api/v1/grocery/:id/:user_id - Delete Grocery Item", () => {
      it("should delete the grocery item and return 200 status", async () => {
        const response = await request(app).delete(
          `/api/v1/grocery/${groceryId}/${userId}`,
        );

        expect(response.status).toBe(statusCode.OK);
      });

      it("should not delete the grocery item and return 401 status (accessing by user role)", async () => {
        const response = await request(app).delete(
          `/api/v1/grocery/${groceryId}/2`,
        );

        expect(response.status).toBe(statusCode.UNAUTHORIZED);
      });

      it("should not delete the grocery item and return 404 status (invalid ID)", async () => {
        const response = await request(app).delete(`/api/v1/grocerys/1`);

        expect(response.status).toBe(statusCode.NOT_FOUND);
      });
    });
  });

  describe("Order RestAPIs Tests", () => {
    let orderId: string;
    let userId = 2;
    let groceryId = 1;

    describe("POST /api/v1/grocery - Create Grocery Item", () => {
      it("should create a new grocery item and return 201 status", async () => {
        const groceryData = {
          user_id: 1,
          name: "Sample Grocery Item",
          price: 10.99,
          quantity: 100,
          category: "snacks",
        };

        const response = await request(app)
          .post("/api/v1/grocery")
          .send(groceryData)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(statusCode.CREATED);
        expect(response.body.data[0]).toHaveProperty("id");
        expect(response.body.data[0].name).toBe(groceryData.name);
        expect(response.body.data[0].quantity).toBe(groceryData.quantity);

        // Store groceryId for later tests
        groceryId = response.body.data[0].id;
      });
    });

    describe("POST /api/v1/order - Create Order", () => {
      it("should create a new order and return 201 status", async () => {
        const orderData = {
          user_id: userId,
          address: "123 Main St, Anytown, USA",
          items: [{ grocery_id: groceryId, quantity: 2 }],
        };

        const response = await request(app)
          .post("/api/v1/order")
          .send(orderData)
          .set("Content-Type", "application/json");

        expect(response.status).toBe(statusCode.CREATED);
        expect(response.body.data[0]).toHaveProperty("id");
        expect(response.body.data[0].address).toBe(orderData.address);

        // Store orderId for later tests
        orderId = response.body.data[0].id;
      });
    });

    describe("GET /api/v1/order - Get Orders List", () => {
      it("should fetch a list of orders and return 200 status", async () => {
        const response = await request(app).get("/api/v1/order");

        expect(response.status).toBe(statusCode.OK);
        expect(response.body.data).toBeInstanceOf(Array);
      });
    });
  });
});
