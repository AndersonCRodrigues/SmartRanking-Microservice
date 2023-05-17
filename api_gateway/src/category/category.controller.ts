import { Controller } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { config } from 'dotenv';

config();

const { RABBITMQ_URL } = process.env;

@Controller('category')
export class CategoryController {
  private clienteAdminBackend: ClientProxy;

  constructor() {
    this.clienteAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL],
        queue: 'admin-backend',
        noAck: false,
      },
    });
  }
}
