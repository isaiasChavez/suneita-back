module.exports = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrationTableName: 'migrations',
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  ssl: false,
  extra: {
    max: 25,
    min: 1,
    ssl: false,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  cli: {
    migrationsDir: 'dist/database/migrations',
  },
  // synchronize: true,
};
