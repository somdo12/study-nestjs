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
    // 1. ตั้งค่า Global Logger (Winston) ที่นี่!
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const uploadDir = './uploads/images';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Created upload/image folder');
    }
    app.enableCors({
        origin: '*',  // อนุญาตทุก origin (สำหรับ dev)
        credentials: true,
    });

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });

    // 2. ตั้งค่า Global ValidationPipe (ไม่มี 'logger' property)
    app.useGlobalPipes(new ValidationPipe({
        // ปรับการตั้งค่าเพิ่มเติม
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        // ลบ property 'logger: new WinstonLoggerService()' ออกจากที่นี่
    }));

    // 3. ตั้งค่า Swagger
    const config = new DocumentBuilder()
        .setTitle('My Awesome NestJS API') // ชื่อ API ของคุณ
        .setDescription('API documentation for Auth and Product modules.') // คำอธิบาย
        .setVersion('1.0')
        // ไม่ได้เปิดใช้ .addTag('auth') และ .addTag('product') แต่แนะนำให้เปิดใช้
        .addTag('auth')
        .addTag('product')
        .addBearerAuth() // เพิ่มช่องสำหรับใส่ JWT/Bearer Token
        .build();

    // 4. สร้างเอกสารและตั้งค่า Swagger UI
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document); // 'api/docs' คือ URL ที่จะเข้าถึง UI

    await app.listen(3000);
}
bootstrap();