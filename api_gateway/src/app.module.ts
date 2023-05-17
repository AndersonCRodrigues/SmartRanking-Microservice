import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { CategoryModule } from './category/category.module';
import { ChallengeModule } from './challenge/challenge.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [PlayerModule, CategoryModule, ChallengeModule, ProxyrmqModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
