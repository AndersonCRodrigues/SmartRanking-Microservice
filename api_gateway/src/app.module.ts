import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { CategoryModule } from './category/category.module';
import { ChallengeModule } from './challenge/challenge.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    PlayerModule,
    CategoryModule,
    ChallengeModule,
    ProxyRMQModule,
    S3Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
