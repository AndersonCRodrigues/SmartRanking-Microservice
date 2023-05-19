import { Controller, Logger } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ICategory } from './interfaces/category.interface';

const ackErrors = ['E1100'];

@Controller()
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);

  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('create-category')
  async createCategory(
    @Payload() category: ICategory,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    let error: any | null;
    try {
      this.logger.log(`category: ${JSON.stringify(category)}`);
      return await this.categoryService.createCategory(category);
    } catch (e) {
      this.logger.log(`error: ${JSON.stringify(e.message)}`);
      error = e;
    } finally {
      await this.updateAck(channel, originalMsg, error);
    }
  }

  @MessagePattern('get-categories')
  async getCategories(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<ICategory | ICategory[]> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    let error: any | null;
    try {
      if (id) {
        return this.categoryService.getCategoryById(id);
      }
      return this.categoryService.getAllCategories();
    } catch (e) {
      this.logger.log(`error: ${JSON.stringify(e.message)}`);
      error = e;
    } finally {
      await this.updateAck(channel, originalMsg, error);
    }
  }

  @MessagePattern('update-category')
  async updateCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    let error: any | null;
    try {
      const { id } = data;
      const category: ICategory = data.category;
      return await this.categoryService.updateCategory(id, category);
    } catch (e) {
      error = e;
    } finally {
      await this.updateAck(channel, originalMsg, error);
    }
  }

  private async updateAck(
    channel: any,
    originalMsg: any,
    e?: any,
  ): Promise<void> {
    if (e) {
      ackErrors.forEach(async (ackError) => {
        if (e.message.includes(ackError)) {
          await channel.ack(originalMsg);
        }
      });
    } else {
      await channel.ack(originalMsg);
    }
  }
}
