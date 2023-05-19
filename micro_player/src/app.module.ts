import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { config } from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';

config();

const { MONGODB_URL } = process.env;
@Module({
  imports: [MongooseModule.forRoot(MONGODB_URL), PlayerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
