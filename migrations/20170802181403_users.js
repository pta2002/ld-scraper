exports.up = function(knex, Promise) {
 return knex.schema.createTable('users', (table) => {
    table.int('id').primary()
    table.string('name')
    table.int('game_id')
  }) 
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users') 
};
