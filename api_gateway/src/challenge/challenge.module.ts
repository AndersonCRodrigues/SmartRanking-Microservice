import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { ChallengeService } from './challenge.service';

@Module({
  imports: [ProxyRMQModule],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
