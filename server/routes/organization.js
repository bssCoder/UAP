const {
  createOrganization,
  addDomain,
  removeDomain,
} = require("../controllers/organization");
const express = require("express");
const router = express.Router();
const Middleware = require("../middleware/admin");

router.post("/create", createOrganization);
router.post("/domain/add", Middleware, addDomain);
router.post("/domain/remove", Middleware, removeDomain);

module.exports = router;
