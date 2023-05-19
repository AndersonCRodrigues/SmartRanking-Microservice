import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { ChallengeService } from './challenge.service';
import { S3Module } from 'src/s3/s3.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [ProxyRMQModule, S3Module, CategoryModule],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
