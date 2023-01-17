const Category = require("../models/category");
const Item = require("../models/item");

const async = require("async");

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
  // Todo
};

exports.item_create_post = (req, res, next) => {
  // Todo
};

exports.item_update_get = (req, res, next) => {
  // Todo
};

exports.item_update_post = (req, res, next) => {
  // Todo
};

exports.item_delete_get = (req, res, next) => {
  // Todo
};

exports.item_delete_post = (req, res, next) => {
  // Todo
};
