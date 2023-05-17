import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { CategoryModule } from './category/category.module';
import { ChallengeModule } from './challenge/challenge.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [PlayerModule, CategoryModule, ChallengeModule, ProxyRMQModule, AwsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
