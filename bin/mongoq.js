#!/usr/bin/env node

const MongoClient = require('mongodb').MongoClient;
const utils = require('util');
const minimist = require('minimist');
const { SecretsManager } = require('@dopplerhq/doppler-node');
require('dotenv').config();

// Parse the command line arguments
const args = minimist(process.argv.slice(2));
const command = args._[0];
const db_name = args.db || 'mydb';  // Use "mydb" as default database name
const collection_name = args.collection || 'mycollection';  // Use "mycollection" as default collection name
const prg_args = { ...args };
delete prg_args._;
delete prg_args.db;
delete prg_args.collection;

// Load the MongoDB credentials from Doppler
const doppler = new SecretsManager({
  project: process.env.DOPPLER_PROJECT || 'default',
  config: process.env.DOPPLER_CONFIG || 'default',
  environment: process.env.DOPPLER_ENVIRONMENT || 'development',
});
const username = await doppler.getSecret('mongo_username');
const password = await doppler.getSecret('mongo_password');
const uri = `mongodb://${username}:${password}@localhost:27017/${db_name}`;

// Set up the MongoDB client and connect to the database
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  if (err) {
    console.error(err);
    return;
  }

  // Get a reference to the database and collection
  const db = client.db(db_name);
  const collection = db.collection(collection_name);

  // Construct the query and update
  const query = { ...prg_args };
  const update = { $set: { ...prg_args } };
  const options = { upsert: true };

  // Execute the appropriate MongoDB command and print the results
  if (command === 'findOne') {
    collection.findOne(query, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(utils.inspect(result, { colors: true, depth: null }));
      client.close();
    });
  } else if (command === 'updateOne') {
    collection.updateOne(query, update, options, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(result.modifiedCount + ' document(s) updated');
      client.close();
    });
  } else if (command === 'upsert') {
    collection.updateOne(query, update, options, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(result.modifiedCount + ' document(s) updated');
      if (result.upsertedCount === 1) {
        console.log('New document inserted with _id: ' + result.upsertedId._id);
      }
      client.close();
    });
  } else if (command === 'remove') {
    collection.deleteOne(query, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(result.deletedCount + ' document(s) deleted');
      client.close();
    });
  } else {
    console.error('Invalid command');
    client.close();
  }
});
