import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [CategoryModule, PlayerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
