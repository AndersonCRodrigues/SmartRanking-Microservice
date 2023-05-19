import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { CategoryService } from './category.service';

@Module({
  imports: [ProxyRMQModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
