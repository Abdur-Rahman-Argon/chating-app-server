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

    //View One Unique User
    app.get("/viewUser/:userId", async (req, res) => {
      const id = req.params.userId;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // ----------------------my-profile-&-Update---------------

    // update Heading
    app.put("/Heading/:id", async (req, res) => {
      const id = req.params.id;
      const { profileHeading, profileBio } = req.body;
      const query = { _id: ObjectId(id) };
      const updateDocument = {
        $set: {
          Heading: { profileHeading, profileBio },
        },
      };
      const result = await userCollection.updateOne(query, updateDocument);
      res.send(result);
    });

    // My Profile information
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // update personal
    app.put("/relationship/:id", async (req, res) => {
      const id = req.params.id;
      const { relationship } = req.body;
      const query = { _id: ObjectId(id) };
      const updateDocument = {
        $set: {
          relationship: relationship,
        },
      };
      const result = await userCollection.updateOne(query, updateDocument);
      res.send(result);
    });

    // update contact
    app.put("/contact/:id", async (req, res) => {
      const id = req.params.id;
      const { phoneNumber, Address } = req.body;
      const query = { _id: ObjectId(id) };
      const updateDocument = {
        $set: {
          contact: { phoneNumber, Address },
        },
      };
      const result = await userCollection.updateOne(query, updateDocument);
      res.send(result);
    });

    // update Contact
    app.patch("/contactUpdate/:id", async (req, res) => {
      const id = req.params.id;
      const contact = req.body;
      const query = { _id: ObjectId(id) };
      const updateDocument = {
        $set: {
          contact: contact,
        },
      };
      const result = await userCollection.updateOne(query, updateDocument);
      res.send(result);
    });

    // update Contact
    // update Contact

    // ------------------Post--------------------------------

    //create new blog post
    app.post("/createPost", async (req, res) => {
      const data = req.body;
      const post = data;
      const result = await postCollection.insertOne(post);
      res.send(result);
    });

    // get all post
    app.get("/allPost", async (req, res) => {
      const query = {};
      const cursor = await postCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //get Love Post
    app.get("/MyPost/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = await postCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Like a post
    app.patch("/likeAdd/:postId", async (req, res) => {
      const id = req.params.postId;
      const likes = req.body;
      const query = { _id: ObjectId(id) };
      const updateDocument = {
        $push: { likes: likes },
      };
      const result = await postCollection.updateOne(query, updateDocument);
      res.send(result);
    });

    // comment update
    app.patch("/commentAdd/:postId", async (req, res) => {
      const id = req.params.postId;
      const comment = req.body;
      const query = { _id: ObjectId(id) };
      const updateDocument = {
        $push: { comments: comment },
      };
      const result = await postCollection.updateOne(query, updateDocument);
      res.send(result);
    });

    //get Love Post
    app.get("/lovePost/:email", async (req, res) => {
      const email = req.params.email;
      const like = { userEmail: email };
      console.log(like);
      const query = { likes: { $elemMatch: { userEmail: email } } };
      const cursor = await postCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // ------------------Message------------------------------

    // create conversation
    app.post("/createConversation", async (req, res) => {
      const data = req.body;
      const post = { member: [data.senderId, data.receiverId] };
      const result = await conversationCollection.insertOne(post);
      res.send(result);
    });

    // get conversation
    app.get("/getConversation/:userId", async (req, res) => {
      const senderId = req.params.userId;
      const query = { member: { $in: [senderId] } };
      const cursor = await conversationCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get conversation
    app.get("/oneConversation/:Id", async (req, res) => {
      const id = req.params.Id;
      const likes = req.body;
      const query = { _id: ObjectId(id) };
      const cursor = await conversationCollection.findOne(query);
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
