module.exports = {
  sever_port: 8000,
  db_schemas: [
    {
      schemaName: "userSchema",
      modelName: "User",
    },
    {
      schemaName: "bookSchema",
      modelName: "Book",
    },
    {
      schemaName: "checkoutSchema",
      modelName: "Checkout",
    },
  ],
  middleware_info: [
    {
      path: "/user",
    },
    {
      path: "/book",
    },
  ],
};
