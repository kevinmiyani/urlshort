const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const Connection = require("./database/db");
const { generateUniqueId } = require("./helper");
require("dotenv").config();

const app = express();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const port = process.env.PORT;

Connection(username, password);

// app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  const fullUrl = req.body.fullUrl;
  const urlLength = req.body.urlLength;
  const uniqueId = generateUniqueId(urlLength);
  await ShortUrl.create({ full: fullUrl, short: uniqueId });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(port, () =>
  console.log(`Server is running successfully on PORT ${port}`)
);
