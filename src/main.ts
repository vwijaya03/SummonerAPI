import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('LOL Integration API')
    .setDescription(
      'Build CI/CD Github Actions LOL Integration API With NestJS, Redis, PostgreSQL And Deploy To AWS EC2',
    )
    .setVersion('1.0')
    // .addTag('your-tag') // Add tags as needed
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-documentation', app, document);

  await app.listen(3000);
}
bootstrap();
