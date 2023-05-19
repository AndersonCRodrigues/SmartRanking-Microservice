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
import { CreateCategoryDto } from './dtos/create_category.dto';
import { UpdateCategoryDto } from './dtos/update_category.dto';
import { CategoryService } from './category.service';

@Controller('api/v1/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  getCategory(@Query('idCategory') _id: string) {
    return this.categoryService.getCategories(_id);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateCategorie(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }
}
