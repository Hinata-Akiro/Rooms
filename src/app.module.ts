import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RoomsModule } from './rooms/rooms.module';
import { QueriesModule } from './queries/queries.module';
import { envValidator } from './helpers/env.validors';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envValidator,
    }),
    DatabaseModule,
    RoomsModule,
    QueriesModule,
    NestjsFormDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
