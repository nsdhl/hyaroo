import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [
      'https://likewows.com',
      'https://admin.likewows.com',
      'https://www.likewows.com',
      'http://localhost:3001',
      'http://localhost:5050',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: 'Authorization, Content-Type',
    credentials: false,
    optionsSuccessStatus: 204,
  });
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
