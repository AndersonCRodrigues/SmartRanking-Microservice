import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [PlayerModule, CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
