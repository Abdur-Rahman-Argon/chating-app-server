const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jz2aljx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const collection = client.db("test").collection("devices");

    const userCollection = client.db("Users").collection("UserCollection");

    const postCollection = client.db("Users").collection("PostCollection");

    const conversationCollection = client
      .db("Messages")
      .collection("conversation");
    const messageCollection = client.db("Messages").collection("message");

    const groupConversationCollection = client
      .db("GroupMessages")
      .collection("groupConversation");
    const groupMessageCollection = client
      .db("GroupMessages")
      .collection("groupMessage");

    //------------------- View-others-Users--------------------

    // Create new user
    app.put("/users/:email", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          user: user,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);

      res.send({ result, status: 200, success: true });
    });

    //Get All User
    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = await userCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // ------------------Post--------------------------------

    //
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server Is run Successfully ");
});

app.listen(port, () => {
  console.log(`Our Server is Run on port ${port}`);
});
