const Category = require("../models/category");
const Item = require("../models/item");

const async = require("async");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

exports.index = (req, res, next) => {
  async.parallel(
    {
      categories(cb) {
        Category.find(cb);
      },
      items(cb) {
        Item.find().populate("category").exec(cb);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("items_display", {
        title: "Items",
        items: results.items,
        categories: results.categories,
      });
    }
  );
};

exports.item_get = (req, res, next) => {
  const id = req.params.id;
  Item.findById(id)
    .populate("category")
    .exec((err, item) => {
      if (err) {
        return next(err);
      }
      if (item == null) {
        res.redirect("/items");
        return;
      }
      res.render("item_display", {
        title: item.name,
        item,
      });
    });
};

exports.item_create_get = (req, res, next) => {
  Category.find((err, categories) => {
    if (err) {
      return next(err);
    }
    res.render("item_create", {
      title: "Create Item",
      categories,
    });
  });
};

exports.item_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name field is required"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Description field must be at least 10 characters"),
  body("price").isNumeric({ min: 1 }).withMessage("price must be at least $1"),
  body("number_in_stock")
    .isNumeric({ min: 1 })
    .withMessage("There must be at least 1 item in stock for this product"),
  (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      category: req.body.category,
      img: {
        data: fs.readFileSync(
          path.join(
            __dirname,
            "../uploads/",
            req.file ? req.file.filename : "0762ae9c5ddbd5b0e92f23ecec91a98c"
          )
        ),
        contentType: "image/png",
      },
    });
    console.log(req.file);
    if (!errors.isEmpty()) {
      Category.find((err, categories) => {
        if (err) {
          return next(err);
        }
        res.render("item_create", {
          title: "Create Item",
          categories,
          item,
          errors: errors.array(),
          selected_category: item.category,
        });
        return;
      });
      return;
    }
    item.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(item.url);
    });
  },
];

exports.item_update_get = (req, res, next) => {
  async.parallel(
    {
      item(cb) {
        Item.findById(req.params.id).populate("category").exec(cb);
      },
      categories(cb) {
        Category.find(cb);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        res.redirect("/items");
        return;
      }
      res.render("item_create", {
        title: "Update Item",
        item: results.item,
        categories: results.categories,
        selected_category: results.item.category,
        update: true,
      });
    }
  );
};

exports.item_update_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name field is required"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Description field must be at least 10 characters"),
  body("price").isNumeric({ min: 1 }).withMessage("price must be at least $1"),
  body("number_in_stock")
    .isNumeric({ min: 1 })
    .withMessage("There must be at least 1 item in stock for this product"),
  (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      category: req.body.category,
      img: {
        data: fs.readFileSync(
          path.join(
            __dirname,
            "../uploads/",
            req.file ? req.file.filename : "0762ae9c5ddbd5b0e92f23ecec91a98c"
          )
        ),
        contentType: "image/png",
      },
      _id: req.params.id,
    });
    console.log(req.body);
    if (!errors.isEmpty()) {
      Category.find((err, categories) => {
        if (err) {
          return next(err);
        }
        res.render("item_create", {
          title: "Update Item",
          categories,
          item,
          errors: errors.array(),
          selected_category: item.category,
          update: true,
        });
      });
      return;
    }
    Item.findByIdAndUpdate(req.params.id, item, {}, (err, updatedItem) => {
      if (err) {
        return next(err);
      }
      res.redirect(updatedItem.url);
    });
  },
];

exports.item_delete_get = (req, res, next) => {
  res.render("item_delete", {
    title: "Delete Item",
    item_id: req.params.id,
  });
};

exports.item_delete_post = (req, res, next) => {
  Item.findByIdAndDelete(req.body.id, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/items");
  });
};
