const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function insert(document) {
  try {
    document = JSON.parse(document);

    await client.connect();
    const database = client.db('testDB');
    const collection = database.collection('testCollection');

    const result = await collection.insertOne(document);
    // console.log('Inserted document:', result.ops[0]);
    console.log('Inserted document:', {result});
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

module.exports = insert;
