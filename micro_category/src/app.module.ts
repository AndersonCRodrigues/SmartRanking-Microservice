import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { config } from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

config();

const { MONGODB_URL } = process.env;
@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URL),
    CategoryModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
