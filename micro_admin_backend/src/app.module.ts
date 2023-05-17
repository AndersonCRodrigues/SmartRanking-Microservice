import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { PlayerModule } from './player/player.module';
import { config } from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';

config();

const { MONGODB_URL } = process.env;
@Module({
  imports: [MongooseModule.forRoot(MONGODB_URL), CategoryModule, PlayerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
