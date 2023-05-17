import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { CategoryModule } from './category/category.module';
import { ChallengeModule } from './challenge/challenge.module';

@Module({
  imports: [PlayerModule, CategoryModule, ChallengeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
