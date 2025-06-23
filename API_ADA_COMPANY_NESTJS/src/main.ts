import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './interfaces/http/middleware/logging.interceptor';

async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
   origin: ['http://localhost:3000', 'https://newadacompany.vercel.app'], // ajuste os domínios
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true,
  });
  
  // Adicionar ValidationPipe global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Adicionar interceptor global de logging
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API ADA Company')
    .setDescription('API para gerenciamento de serviços da ADA Company')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticação')
    .addTag('clientes', 'Gerenciamento de clientes')
    .addTag('funcionarios', 'Gerenciamento de funcionários')
    .addTag('pacotes', 'Gerenciamento de pacotes')
    .addTag('orcamentos', 'Gerenciamento de orçamentos')
    .addTag('contratos', 'Gerenciamento de contratos')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(port);
  
  console.log(`Aplicação rodando na porta ${port}`);
  console.log(`Documentação Swagger disponível em: http://localhost:${port}/api`);
}
bootstrap();
