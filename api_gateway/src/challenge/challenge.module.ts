import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';

@Module({
  imports: [ProxyRMQModule],
  controllers: [ChallengeController],
})
export class ChallengeModule {}
