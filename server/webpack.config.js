const nodeExternals = require('webpack-node-externals');

// Tells webpack to ignore TypeORM's optional database drivers that aren't
// installed (Expo, MySQL, Oracle, Mongo, etc.). Without this, the bundler
// tries to resolve every driver and fails on e.g. `expo-sqlite`.
const optionalDrivers = [
  'expo-sqlite',
  '@sap/hana-client',
  '@sap/hana-client/extension/Stream',
  'hdb-pool',
  'mysql',
  'mysql2',
  'oracledb',
  'pg-native',
  'pg-query-stream',
  'sqlite3',
  'better-sqlite3',
  'ioredis',
  'redis',
  'typeorm-aurora-data-api-driver',
  'react-native-sqlite-storage',
  'mongodb',
  'mssql',
  '@google-cloud/spanner',
  '@nestjs/websockets/socket-module',
  '@nestjs/microservices/microservices-module',
  '@nestjs/microservices',
  'class-transformer/storage',
];

module.exports = function (options, webpack) {
  return {
    ...options,
    // Keep node_modules out of the bundle so there is a single runtime copy of
    // every package (notably @nestjs/common) — otherwise `instanceof
    // HttpException` fails across duplicate copies and every HttpException
    // becomes a 500. App code and @app/* aliases are still bundled.
    externals: [nodeExternals({ additionalModuleDirs: ['../node_modules'] })],
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (!optionalDrivers.includes(resource)) {
            return false;
          }
          try {
            // Keep it if it's actually installed; ignore it otherwise.
            require.resolve(resource);
            return false;
          } catch {
            return true;
          }
        },
      }),
    ],
  };
};
