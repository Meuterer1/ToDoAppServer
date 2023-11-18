require("dotenv").config();

const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const database = "todo";

module.exports = async function getTasks() {
  const url = process.env.MONGODB_URL;
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection(database);

    const tasks = await collection.find({}).toArray();
    return tasks;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.close();
  }
};
