import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { S3Module } from 'src/s3/s3.module';
import { S3Service } from 'src/s3/s3.service';
import { PlayerService } from './player.service';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [ProxyRMQModule, S3Module, CategoryModule],
  controllers: [PlayerController],
  providers: [S3Service, PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
