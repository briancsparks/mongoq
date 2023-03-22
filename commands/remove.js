const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const utils = require("util");
dotenv.config();

const uri = process.env.MONGODB_URI;
// console.log(`${uri}`);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function remove(filter) {
  try {
    filter = JSON.parse(filter);
    console.log(utils.inspect(filter, { colors: true, depth: null }));

    await client.connect();
    const database = client.db('testDB');
    const collection = database.collection('testCollection');

    const result = await collection.deleteOne(filter);
    console.log('Deleted document count:', result.deletedCount);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

module.exports = remove;
