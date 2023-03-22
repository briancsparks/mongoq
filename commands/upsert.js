const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function upsert(filter, update) {
  try {
   
    filter = JSON.parse(filter);
    update = JSON.parse(update);

    await client.connect();
    const database = client.db('testDB');
    const collection = database.collection('testCollection');

    const options = { upsert: true };
    const result = await collection.updateOne(filter, update, options);
    console.log('Upserted document count:', result.upsertedCount);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

module.exports = upsert;
