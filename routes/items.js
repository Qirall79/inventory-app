const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

router.get("/", itemController.index);

router.get("/:id", itemController.item_get);

// Create item
router.get("/create", itemController.item_create_get);

router.post("/create", itemController.item_create_post);

// Update item
router.get("/:id/update", itemController.item_update_get);

router.post("/:id/update", itemController.item_update_post);

// Delete item
router.get("/:id/delete", itemController.item_delete_get);

router.post("/:id/delete", itemController.item_delete_post);

module.exports = router;
