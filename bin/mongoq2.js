const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('testDB');
    const collection = database.collection('testCollection');

    // findOne operation
    const findOneFilter = { name: 'John Doe' };
    const findOneResult = await collection.findOne(findOneFilter);
    if (findOneResult) {
      console.log('Document found:', findOneResult);
    } else {
      console.log('No document found matching the findOne filter');
    }

    // updateOne operation
    const updateOneFilter = { name: 'John Doe' };
    const updateOneUpdate = { $set: { age: 42 } };
    const updateOneResult = await collection.updateOne(updateOneFilter, updateOneUpdate);
    console.log('Modified document count:', updateOneResult.modifiedCount);

    // upsert operation (update with upsert flag)
    const upsertFilter = { name: 'Jane Doe' };
    const upsertUpdate = { $set: { age: 28 } };
    const upsertOptions = { upsert: true };
    const upsertResult = await collection.updateOne(upsertFilter, upsertUpdate, upsertOptions);
    console.log('Upserted document count:', upsertResult.upsertedCount);

    // remove operation
    const removeFilter = { name: 'John Doe' };
    const removeResult = await collection.deleteOne(removeFilter);
    console.log('Deleted document count:', removeResult.deletedCount);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the database connection
    await client.close();
  }
}

run();
