import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateCategoryDto } from './dtos/create_category.dto';
import { UpdateCategoryDto } from './dtos/update_category.dto';
import { ClientProxySmartRanking } from 'src/proxyrmq/client.proxy';

@Controller('api/v1/categories')
export class CategoryController {
  constructor(private clientProxy: ClientProxySmartRanking) {}
  private clienteAdminBackend = this.clientProxy.getClienteProxy();

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.clienteAdminBackend.emit('create-category', createCategoryDto);
  }

  @Get()
  getCategory(@Query('idCategory') _id: string): Observable<any> {
    return this.clienteAdminBackend.send('get-categories', _id || '');
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateCategorie(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): void {
    this.clienteAdminBackend.emit('update-category', {
      id,
      category: updateCategoryDto,
    });
  }
}
