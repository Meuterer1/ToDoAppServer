require("dotenv").config();
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const database = "todo";

module.exports = async function deleteTask(deletedItems) {
  const url = process.env.MONGODB_URL;
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection(database);

    const session = client.startSession();

    try {
      session.startTransaction();
      await Promise.all(
        deletedItems.map(
          async (item) => await collection.deleteOne({ _id: item._id })
        )
      );

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      console.error(err);
      throw err;
    } finally {
      session.endSession();
    }
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.close();
  }
};
