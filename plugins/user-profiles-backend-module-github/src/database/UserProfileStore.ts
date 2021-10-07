import { resolvePackagePath } from '@backstage/backend-common';
import { Knex } from 'knex';

const TABLE = 'profiles';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-user-profiles-backend-module-github',
  'migrations',
);

export class UserProfileStore {
  static async create(knex: Knex) {
    await knex.migrate.latest({ directory: migrationsDir });
    return new UserProfileStore(knex);
  }

  private constructor(private readonly db: Knex) {}

  saveProfile(profile: { id: string; name: string }): Promise<void> {
    return this.db.table(TABLE).insert(profile);
  }
}
