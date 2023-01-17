#! /usr/bin/env node

console.log(
  "This script populates some test categories and items to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Category = require("./models/category");
var Item = require("./models/item");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var categories = [];
var items = [];

function categoryCreate(name, description, cb) {
  categoryDetail = { name, description };

  const category = new Category(categoryDetail);

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(name, description, price, category, number_in_stock, cb) {
  itemDetail = { name, description, category, price, number_in_stock };

  const item = new Item(itemDetail);

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function createCategories(cb) {
  async.series(
    [
      function (cb) {
        categoryCreate(
          "Laptop",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis varius quam quisque id. Diam vel quam elementum pulvinar etiam non quam lacus suspendisse.",
          cb
        );
      },
      function (cb) {
        categoryCreate(
          "Phone",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis varius quam quisque id. Diam vel quam elementum pulvinar etiam non quam lacus suspendisse.",
          cb
        );
      },
      function (cb) {
        categoryCreate(
          "Smart Watch",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis varius quam quisque id. Diam vel quam elementum pulvinar etiam non quam lacus suspendisse.",
          cb
        );
      },
      function (cb) {
        categoryCreate(
          "Console",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis varius quam quisque id. Diam vel quam elementum pulvinar etiam non quam lacus suspendisse.",
          cb
        );
      },
    ],
    // optional callback
    cb
  );
}

function createItems(cb) {
  async.series(
    [
      function (cb) {
        itemCreate(
          "Macbook pro M1",
          "Risus nullam eget felis eget nunc lobortis mattis. Risus quis varius quam quisque id diam vel quam elementum. Volutpat blandit aliquam etiam erat velit scelerisque in.",
          1299,
          categories[0],
          7,
          cb
        );
      },
      function (cb) {
        itemCreate(
          "Macbook air M1",
          "Risus nullam eget felis eget nunc lobortis mattis. Risus quis varius quam quisque id diam vel quam elementum. Volutpat blandit aliquam etiam erat velit scelerisque in.",
          999,
          categories[0],
          4,
          cb
        );
      },
      function (cb) {
        itemCreate(
          "Lenovo Legion",
          "Risus nullam eget felis eget nunc lobortis mattis. Risus quis varius quam quisque id diam vel quam elementum. Volutpat blandit aliquam etiam erat velit scelerisque in.",
          899,
          categories[0],
          12,
          cb
        );
      },
      function (cb) {
        itemCreate(
          "iPhone 14 pro max",
          "Risus nullam eget felis eget nunc lobortis mattis. Risus quis varius quam quisque id diam vel quam elementum. Volutpat blandit aliquam etiam erat velit scelerisque in.",
          1499,
          categories[1],
          3,
          cb
        );
      },
      function (cb) {
        itemCreate(
          "Samsung Galaxy S22 Ultra",
          "Risus nullam eget felis eget nunc lobortis mattis. Risus quis varius quam quisque id diam vel quam elementum. Volutpat blandit aliquam etiam erat velit scelerisque in.",
          1199,
          categories[1],
          7,
          cb
        );
      },
      function (cb) {
        itemCreate(
          "Samsung Galaxy Fold",
          "Risus nullam eget felis eget nunc lobortis mattis. Risus quis varius quam quisque id diam vel quam elementum. Volutpat blandit aliquam etiam erat velit scelerisque in.",
          1799,
          categories[1],
          4,
          cb
        );
      },
      function (cb) {
        itemCreate(
          "Apple watch 4",
          "Risus nullam eget felis eget nunc lobortis mattis. Risus quis varius quam quisque id diam vel quam elementum. Volutpat blandit aliquam etiam erat velit scelerisque in.",
          599,
          categories[2],
          14,
          cb
        );
      },
      function (cb) {
        itemCreate(
          "Apple watch 3",
          "Risus nullam eget felis eget nunc lobortis mattis. Risus quis varius quam quisque id diam vel quam elementum. Volutpat blandit aliquam etiam erat velit scelerisque in.",
          449,
          categories[2],
          8,
          cb
        );
      },
    ],
    cb
  );
}

async.series(
  [createCategories, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Categories " + categories);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
