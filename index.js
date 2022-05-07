const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xwdre.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const mobileCollection = client.db("warehouse").collection("mobile");
    app.get("/mobiles", async (req, res) => {
      const query = {};
      const cursor = mobileCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/mobile/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const mobile = await mobileCollection.findOne(query);
      res.send(mobile);
    });
    app.put("/mobile/:id", async (req, res) => {
      const id = req.params.id;
      const quantity = req.body.newQuantity;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: { quantity },
      };
      const result = await mobileCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.delete("/mobile/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await mobileCollection.deleteOne(filter);
      res.send(result);
    });
    app.post("/mobile", async (req, res) => {
      const mobile = req.body.newProduct;
      const result = await mobileCollection.insertOne(mobile);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log("server is running in the command line", port);
});
