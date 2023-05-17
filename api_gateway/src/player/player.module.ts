import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { S3Module } from 'src/s3/s3.module';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [ProxyRMQModule, S3Module],
  controllers: [PlayerController],
  providers: [S3Service],
})
export class PlayerModule {}
