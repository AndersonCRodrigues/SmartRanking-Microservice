import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogginInterceptor } from './interceptors/logging.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { AllExceptionsFilter } from './filters/http.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LogginInterceptor(), new TimeoutInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
