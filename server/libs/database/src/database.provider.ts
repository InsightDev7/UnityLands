import { UserEntity } from '@app/user/infrastructure/persistence/typeorm/entity/user.entity';
import { DataSource } from 'typeorm';

export const DATABASE_SOURCE = 'DATABASE_SOURCE';

export const databaseProvider = {
  provide: DATABASE_SOURCE,
  useFactory: async () => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [UserEntity],
      synchronize: true,
    });

    await dataSource.initialize();
    return dataSource;
  },
};
