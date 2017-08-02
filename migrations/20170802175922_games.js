exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', (table) => {
    table.int('id').primary()
    table.string('name')
    table.string('path')
    table.string('event')
    table.string('body')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('games')
};
