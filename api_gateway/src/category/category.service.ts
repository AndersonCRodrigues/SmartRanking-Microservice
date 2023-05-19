import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client.proxy';
import { CreateCategoryDto } from './dtos/create_category.dto';
import { lastValueFrom } from 'rxjs';
import { UpdateCategoryDto } from './dtos/update_category.dto';

@Injectable()
export class CategoryService {
  constructor(private clientProxy: ClientProxySmartRanking) {}
  private clienteAdminBackend = this.clientProxy.getClienteProxy();

  async createCategory(createCategoryDto: CreateCategoryDto) {
    return lastValueFrom(
      this.clienteAdminBackend.emit('create-category', createCategoryDto),
    );
  }

  async getCategories(id: string) {
    const category = await lastValueFrom(
      this.clienteAdminBackend.send('get-categories', id || ''),
    );
    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.getCategories(id);
    return lastValueFrom(
      this.clienteAdminBackend.emit('update-category', {
        id,
        category: updateCategoryDto,
      }),
    );
  }
}
