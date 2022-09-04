'use strict';

let dbm;
let type;
let seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
export function setup(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
}

export function up(db) {
  db.createTable('platforms', {
    id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    provider_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'platforms_provider_id_fk',
        table: 'provider',
        mapping: 'id'
      }
    },
    account_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'platforms_account_id_fk',
        table: 'account',
        mapping: 'id'
      }
    },
    name: 'string',
    api_token: 'string',
    created_at: 'datetime',
    updated_at: 'datetime',
  });
}

export function down(db) {
  db.dropTable('platforms');
}
