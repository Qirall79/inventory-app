const Category = require("../models/category");
const Item = require("../models/item");

const async = require("async");
const { body, validationResult } = require("express-validator");

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
  res.render("category_create", {
    title: "Create Category",
  });
  return;
};

exports.category_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name field is required")
    .isAlphanumeric()
    .withMessage("Name must contain only alphanumeric characters"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Description field is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    const categoryName =
      req.body.name[0].toUpperCase() + req.body.name.slice(1).toLowerCase();
    const category = new Category({
      name: categoryName,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      res.render("category_create", {
        title: "Create Category",
        errors: errors.array(),
        category,
      });
      return;
    }
    Category.findOne({ name: categoryName }).exec((err, cat) => {
      if (err) {
        return next(err);
      }
      if (cat != null) {
        res.redirect(cat.url);
        return;
      }
      category.save((error) => {
        if (error) {
          return next(error);
        }
        res.redirect(category.url);
        return;
      });
    });
  },
];

exports.category_update_get = (req, res, next) => {
  Category.findById(req.params.id).exec((err, category) => {
    if (err) {
      return next(err);
    }
    res.render("category_create", {
      title: "Update Category",
      category,
      update: true,
    });
  });
};

exports.category_update_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name field is required")
    .isAlphanumeric()
    .withMessage("Name must contain only alphanumeric characters"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Description field must contain at least 10 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    const categoryName =
      req.body.name[0].toUpperCase() + req.body.name.slice(1).toLowerCase();
    const category = new Category({
      name: categoryName,
      description: req.body.description,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.render("category_create", {
        title: "Update Category",
        errors: errors.array(),
        category,
        update: true,
      });
      return;
    }
    Category.findByIdAndUpdate(
      req.params.id,
      category,
      {},
      (err, updatedCategory) => {
        if (err) {
          return next(err);
        }
        res.redirect(updatedCategory.url);
      }
    );
  },
];

exports.category_delete_get = (req, res, next) => {
  async.parallel(
    {
      category(cb) {
        Category.findById(req.params.id).exec(cb);
      },
      category_items(cb) {
        Item.find({ category: req.params.id }).exec(cb);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      res.render("category_delete", {
        title: results.category.name,
        category_items: results.category_items,
        category: results.category,
      });
      return;
    }
  );
};

exports.category_delete_post = (req, res, next) => {
  Category.findByIdAndDelete(req.body.id, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/categories");
  });
};
