require("dotenv").config();

const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const database = "todo";
console.log(
  "getTasks up: ",
  "database: ",
  database,
  "mongoClient: ",
  MongoClient
);
module.exports = async function getTasks() {
  console.log("pierwsze wejscie do getTasks");
  const url = process.env.MONGODB_URL;
  console.log("url: ", url);
  const client = new MongoClient(url);
  console.log("client: ", client);

  console.log("get tasks");
  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection(database);

    console.log("try", "db: ", db, "collection: ", collection);
    const tasks = await collection.find({}).toArray();
    return tasks;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.close();
  }
};
