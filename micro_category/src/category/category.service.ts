import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICategory } from './interfaces/category.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<ICategory>,
  ) {}

  async createCategory(category: ICategory): Promise<ICategory> {
    try {
      const createdCategory = new this.categoryModel(category);
      return createdCategory.save();
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }

  async getCategoryById(id: string): Promise<ICategory> {
    try {
      return this.categoryModel.findById(id);
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }

  async getAllCategories(): Promise<ICategory[]> {
    try {
      return this.categoryModel.find();
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }

  async updateCategory(_id: string, category: ICategory): Promise<void> {
    try {
      return await this.categoryModel.findOneAndUpdate({ _id }, category);
    } catch (e) {
      this.logger.error(`error: ${JSON.stringify(e.message)}`);
      throw new RpcException(e.message);
    }
  }
}
