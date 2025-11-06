import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Travel App API",
      version: "1.0.0",
      description: "API documentation for Travel App - Tour booking system",
      contact: {
        name: "Travel App Support",
        email: "support@travelapp.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: "Development server",
      },
      {
        url: `http://192.168.137.150:${process.env.PORT || 4000}`,
        description: "Local network server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            avatar: { type: "string" },
            role: { type: "string", enum: ["client", "staff", "admin"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Tour: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            location: { type: "string" },
            price: { type: "number" },
            originalPrice: { type: "number" },
            duration: { type: "number" },
            category: { type: "string" },
            featured: { type: "boolean" },
            imageUrl: { type: "string" },
            images: { type: "array", items: { type: "string" } },
            availableSeats: { type: "number" },
            maxSeats: { type: "number" },
            rating: { type: "number" },
            reviewCount: { type: "number" },
            coordinates: {
              type: "object",
              properties: {
                latitude: { type: "number" },
                longitude: { type: "number" },
              },
            },
          },
        },
        Booking: {
          type: "object",
          properties: {
            _id: { type: "string" },
            tourId: { type: "string" },
            userId: { type: "string" },
            quantity: { type: "number" },
            totalPrice: { type: "number" },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
            },
            paymentStatus: {
              type: "string",
              enum: ["pending", "paid", "refunded"],
            },
            travelDate: { type: "string", format: "date" },
            travelers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  age: { type: "number" },
                  idCard: { type: "string" },
                },
              },
            },
            contactInfo: {
              type: "object",
              properties: {
                phone: { type: "string" },
                email: { type: "string" },
              },
            },
            specialRequests: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Review: {
          type: "object",
          properties: {
            _id: { type: "string" },
            tourId: { type: "string" },
            userId: { type: "string" },
            bookingId: { type: "string" },
            rating: { type: "number", minimum: 1, maximum: 5 },
            comment: { type: "string" },
            images: { type: "array", items: { type: "string" } },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
            error: { type: "string" },
            fieldErrors: { type: "object" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);

