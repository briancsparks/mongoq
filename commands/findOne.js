const { MongoClient } = require('mongodb');
const utils = require('util');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI;
// console.log(`${uri}`);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function findOne(filter) {
  try {
    filter = JSON.parse(filter);
    console.log(utils.inspect(filter, { colors: true, depth: null }));
    await client.connect();
    const database = client.db('testDB');
    const collection = database.collection('testCollection');

    const result = await collection.findOne(filter);
    if (result) {
      console.log('Document found:', result);
    } else {
      console.log('No document found matching the filter');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

module.exports = findOne;
