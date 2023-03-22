const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function remove(filter) {
  try {
    filter = JSON.parse(filter);

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
