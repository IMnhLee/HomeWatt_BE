import { NestFactory } from '@nestjs/core';
import { apigatewayModule } from './apigateway.module';

async function bootstrap() {
  const app = await NestFactory.create(apigatewayModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
