const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000; // Heroku will need the PORT environment variable
const publicPath = path.join(__dirname, "build");

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, () => console.log(`App is live on port ${port}!`));
