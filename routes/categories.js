var express = require("express");
var router = express.Router();
const categoryController = require("../controllers/categoryController");

/* Get categories listeners */
router.get("/", categoryController.index);

router.get("/:id", categoryController.category_get);

// Create category
router.get("/create", categoryController.category_create_get);

router.post("/create", categoryController.category_create_post);

// Update category
router.get("/:id/update", categoryController.category_update_get);

router.post("/:id/update", categoryController.category_update_post);

// Delete category
router.get("/:id/delete", categoryController.category_delete_get);

router.post("/:id/delete", categoryController.category_delete_post);

module.exports = router;
