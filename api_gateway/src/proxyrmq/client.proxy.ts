import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
} from '@nestjs/microservices';
import { config } from 'dotenv';

config();

@Injectable()
export class ClientProxySmartRanking {
  private RABBITMQ_URL: string;
  constructor(private configService: ConfigService) {
    this.RABBITMQ_URL = this.configService.get<string>('RABBITMQ_URL');
  }
  getClienteProxy(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.RABBITMQ_URL],
        queue: 'admin-backend',
        noAck: false,
      },
    });
  }
}
