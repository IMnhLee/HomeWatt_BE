import { NestFactory } from '@nestjs/core';
import { apigatewayModule } from './apigateway.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(apigatewayModule);
  
  // Global interceptors
  // app.useGlobalInterceptors(new ResponseTransformInterceptor());
  
  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  
  // Middlewares
  app.use(cookieParser());
  
  // CORS
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
