import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const url = configService.get<string>('RABBITMQ_URL') || 'no_url';

async function bootstrap() {
  const app = NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [url],
      noAck: false,
      queue: 'admin-backend',
    },
  });

  (await app).listen();
}
bootstrap();
