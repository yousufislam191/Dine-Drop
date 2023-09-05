const { seedUser } = require("../controllers/seed.controllers");

const seedRouter = require("express").Router();

seedRouter.get("/users", seedUser);

module.exports = seedRouter;
