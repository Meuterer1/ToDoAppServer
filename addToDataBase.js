require("dotenv").config();

const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const database = "todo";

module.exports = async function AddToDataBase(object) {
  const url = process.env.MONGODB_URL;
  console.log("url: ", url);
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(database);
    const collections = await db.collection(database);

    const options = {
      ordered: true,
    };

    if (object) {
      await collections.insertMany(object, options);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
};
