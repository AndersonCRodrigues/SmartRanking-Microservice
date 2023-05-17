import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
config();

const URL = process.env.RABBIT_URL || 'no_url';

async function bootstrap() {
  const app = NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [URL],
      noAck: false,
      queue: 'admin-backend',
    },
  });

  (await app).listen();
}
bootstrap();
