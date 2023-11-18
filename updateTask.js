require("dotenv").config();

const mongo = require("mongodb");
const { ObjectId } = mongo;
const MongoClient = mongo.MongoClient;
const database = "todo";

module.exports = async function updateTask(updateFields) {
  const url = process.env.MONGODB_URL;
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(database);
    const collection = await db.collection(database);

    const session = client.startSession();

    try {
      session.startTransaction();
      for (const item of updateFields) {
        const itemId = new ObjectId(item._id);
        const update = {
          $set: item,
        };
        await collection.updateOne({ _id: item._id }, update, {
          session,
        });
      }

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      console.error(err.response.data);
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
