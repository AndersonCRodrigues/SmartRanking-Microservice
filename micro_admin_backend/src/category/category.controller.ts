import { Controller, Logger } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  Ctx,
  EventPattern,
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

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: ICategory,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`category: ${JSON.stringify(category)}`);
      await this.categoryService.createCategory(category);
      await this.updateAck(channel, originalMsg);
    } catch (e) {
      this.logger.log(`error: ${JSON.stringify(e.message)}`);
      await this.updateAck(channel, originalMsg, e);
    }
  }

  @MessagePattern('get-categories')
  async getCategories(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<ICategory | ICategory[]> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (id) {
        return this.categoryService.getCategoryById(id);
      }
      return this.categoryService.getAllCategories();
    } finally {
      await this.updateAck(channel, originalMsg);
    }
  }

  @EventPattern('update-category')
  async updateCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const { id } = data;
      const category: ICategory = data.category;
      await this.categoryService.updateCategory(id, category);
      await this.updateAck(channel, originalMsg);
    } catch (e) {
      await this.updateAck(channel, originalMsg, e);
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
