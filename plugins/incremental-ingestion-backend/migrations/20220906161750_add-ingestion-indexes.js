/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const schema = () => knex.schema.withSchema('ingestion');

  await knex.raw(
    `CREATE INDEX IF NOT EXISTS increment_ingestion_provider_name_idx ON public.final_entities ((final_entity::json #>> '{metadata, annotations, backstage.io/incremental-provider-name}'));`,
  );

  await knex.raw(`DROP VIEW IF EXISTS ingestion.current_entities`);

  await schema().alterTable('ingestions', t => {
    t.primary('id');
    t.index('provider_name', 'ingestion_provider_name_idx');
  });

  await schema().alterTable('ingestion_marks', t => {
    t.primary('id');
    t.index('ingestion_id', 'ingestion_mark_ingestion_id_idx');
  });

  await schema().alterTable('ingestion_mark_entities', t => {
    t.primary('id');
    t.index('ingestion_mark_id', 'ingestion_mark_entity_ingestion_mark_id_idx');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const schema = () => knex.schema.withSchema('ingestion');

  await schema().alterTable('ingestions', t => {
    t.dropIndex('provider_name', 'ingestion_provider_name_idx');
    t.dropPrimary('id');
  });

  await schema().alterTable('ingestion_marks', t => {
    t.dropIndex('ingestion_id', 'ingestion_mark_ingestion_id_idx');
    t.dropPrimary('id');
  });

  await schema().alterTable('ingestions_mark_entities', t => {
    t.dropIndex('ingestion_mark_id', 'ingestion_mark_entity_ingestion_mark_id_idx');
    t.dropPrimary('id');
  });

  await knex.raw(`DROP INDEX increment_ingestion_provider_name_idx;`);
};
