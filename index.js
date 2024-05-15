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


app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.redirect("https://shortlink-opal.vercel.app/");
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

app.get("/getpagedata", async (req, res) => {
  try {
    console.log("req.query.page", req.query);
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;

    const shortUrls = await ShortUrl.find().skip(skip).limit(limit);
    const totalCount = await ShortUrl.countDocuments();

    res.json({
      shortUrls,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addurls", async (req, res) => {
  const hundredurls = await genratehundred();
  shortUrl
    .insertMany(hundredurls)
    .then((respose) => {
      res.status(201).json({ message: "data added succesfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed Add Data", error: error });
    });
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

