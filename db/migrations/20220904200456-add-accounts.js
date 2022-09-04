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
  db.createTable('accounts', {
    id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },

    name: 'string',
    email: 'string',
    password: 'string',
    created_at: 'datetime',
    updated_at: 'datetime',
  });
}

export function down(db) {
  db.dropTable('accounts');
}
