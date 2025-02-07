import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Caduceu')
    .setDescription('The Caduceu API description')
    .setVersion('0.0.1')
    .setContact('Dev Team', 'https://caduceu.com', 'dev@caduceu.com')
    .addTag('🔐 Auth', 'Autenticação e autorização')
    .addTag('👤 Users', 'Operações com usuários')
    .addTag('🙆‍♂️ Clients', 'Gestão de clientes')
    .addTag('📦 Product', 'Gestão de produtos')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      // docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        theme: 'monokai'
      }
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Caduceu API Docs',
    customfavIcon: 'https://exemplo.com/favicon.ico',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
