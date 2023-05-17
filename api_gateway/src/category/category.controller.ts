import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { config } from 'dotenv';
import { Observable } from 'rxjs';

config();

const { RABBITMQ_URL } = process.env;

@Controller('category')
export class CategoryController {
  private clienteAdminBackend: ClientProxy;

  constructor() {
    this.clienteAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL],
        queue: 'admin-backend',
        noAck: false,
      },
    });
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.clienteAdminBackend.emit('create-category', createCategoryDto);
  }

  @Get('categories')
  getCategory(@Query('idCategory') _id: string): Observable<any> {
    return this.clienteAdminBackend.send('get-categories', _id || '');
  }

  @Patch('categories/:id')
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
