// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as fs from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonLoggerService } from './common/logger/winston-logger.service'; // นำเข้า Service ที่สร้าง

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const uploadDir = './uploads/images';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Created upload/image folder');
    }
    app.enableCors({
        origin: '*', 
        credentials: true,
    });

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    // 3. ตั้งค่า Swagger
    const config = new DocumentBuilder()
        .setTitle('My Awesome NestJS API') 
        .setDescription('API documentation for Auth and Product modules.') 
        .setVersion('1.0')
        .addTag('auth')
        .addTag('product')
        .addBearerAuth()
        .build();


    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document); // 'api/docs' คือ URL ที่จะเข้าถึง UI

    await app.listen(3000);
    console.log(' Swagger API docs: http://localhost:3000/api/docs');
}
bootstrap();