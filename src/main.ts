import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './auth/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 8080;
  const GRPC_URL = configService.get<string>('GRPC_URL');
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(PORT, '0.0.0.0', () => {
    logger.log(`Application is running on: ${PORT}, url: ${GRPC_URL}`);
  });
}
bootstrap();
