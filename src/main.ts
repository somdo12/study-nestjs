// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        // ปรับการตั้งค่าเพิ่มเติม 
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new DocumentBuilder()
        .setTitle('My Awesome NestJS API') // ชื่อ API ของคุณ
        .setDescription('API documentation for Auth and Product modules.') // คำอธิบาย
        .setVersion('1.0') // เวอร์ชัน
        .addTag('auth') // เพิ่มแท็กสำหรับจัดกลุ่ม endpoints
        .addTag('product')
        .addBearerAuth() // เพิ่มช่องสำหรับใส่ JWT/Bearer Token
        .build();

    // 2. สร้างเอกสาร
    const document = SwaggerModule.createDocument(app, config);

    // 3. ตั้งค่า Swagger UI
    SwaggerModule.setup('api/docs', app, document); // 'api/docs' คือ URL ที่จะเข้าถึง UI
    await app.listen(3000);
}
bootstrap();