import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { config } from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
config();

const { MONGODB_URL } = process.env;

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URL),
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
    ])
  ]
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
