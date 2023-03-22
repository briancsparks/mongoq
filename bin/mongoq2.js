const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

// const uri = process.env.MONGODB_URI || `mongodb://localhost:27017/testDB`;
const uri = process.env.MONGODB_URI;
console.log(`Connection string ${uri}`)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('testDB');
    const collection = database.collection('testCollection');

    // Define a filter for the findOne query
    const filter = { name: 'John Doe' };

    // Execute the findOne query
    const result = await collection.findOne(filter);

    if (result) {
      console.log('Document found:', result);
    } else {
      console.log('No document found matching the filter');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the database connection
    await client.close();
  }
}

run();
