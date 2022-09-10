const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server Is run Successfully ");
});

app.listen(port, () => {
  console.log(`Our Server is Run on port ${port}`);
});
