#!/usr/bin/env node
const { program } = require('commander');
const findOne = require('./commands/findOne');
const updateOne = require('./commands/updateOne');
const upsert = require('./commands/upsert');
const remove = require('./commands/remove');
const insert = require('./commands/insert');

program.version('1.0.0');

program
  .command('findOne <filter>')
  .description('Find a single document that matches the given filter')
  .action(findOne);

program
  .command('updateOne <filter> <update>')
  .description('Update a single document that matches the given filter')
  .action(updateOne);

program
  .command('upsert <filter> <update>')
  .description('Update a single document that matches the given filter, or insert a new document if no match is found')
  .action(upsert);

program
  .command('remove <filter>')
  .description('Remove a single document that matches the given filter')
  .action(remove);

program
  .command('insert <document>')
  .description('Insert a new document into the collection')
  .action(insert);

program.parse(process.argv);
