const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const ShortUrl = require("./models/shortUrl");
const Connection = require("./database/db");
const { generateUniqueId } = require("./helper");
require("dotenv").config();

const app = express();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const port = process.env.PORT || 4000;

Connection(username, password);

app.use(express.static(__dirname + "public"));
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "my-frontend", "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "my-frontend", "build", "index.html"));
});

app.get("/getdata", async (req, res) => {
  try {
    const shortUrls = await ShortUrl.find();
    res.json({ shortUrls });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/shortUrls", async (req, res) => {
  try {
    const { fullUrl, urlLength } = req.body;
    const uniqueId = await generateUniqueId(urlLength);
    console.log({ full: fullUrl, short: uniqueId });
    await ShortUrl.create({ full: fullUrl, short: uniqueId });

    res.status(201).json({ message: "succesfully created short URL" });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: "Failed to create short URL" });
  }
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
