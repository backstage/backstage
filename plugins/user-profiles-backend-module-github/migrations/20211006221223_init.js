exports.up = function (knex) {
  return knex.schema.createTable('profiles', table => {
    table.comment('The table of all profiles');
    table.string('id').primary().notNullable().comment('The ID of the user');
    table.string('name').notNullable().comment('The name of the user');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('profiles');
};
