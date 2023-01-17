const Category = require("../models/category");
const Item = require("../models/item");

exports.index = (req, res, next) => {
  Category.find((err, categories) => {
    if (err) {
      return next(err);
    }
    res.render("categories_display", {
      title: "Categories",
      categories,
    });
  });
};

exports.category_get = (req, res, next) => {
  const id = req.params.id;
  Category.findById(id).exec((err, category) => {
    if (err) {
      return next(err);
    }
    if (category == null) {
      res.redirect("/categories");
      return;
    }

    Item.find({ category: category._id }).exec((err, category_items) => {
      if (err) {
        return next(err);
      }
      res.render("category_display", {
        title: category.name,
        category,
        category_items,
      });
    });
  });
};

exports.category_create_get = (req, res, next) => {
  // Todo
};

exports.category_create_post = (req, res, next) => {
  // Todo
};

exports.category_update_get = (req, res, next) => {
  // Todo
};

exports.category_update_post = (req, res, next) => {
  // Todo
};

exports.category_delete_get = (req, res, next) => {
  // Todo
};

exports.category_delete_post = (req, res, next) => {
  // Todo
};
