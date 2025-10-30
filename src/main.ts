// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 🔑 นี่คือส่วนสำคัญ: การใช้ ValidationPipe เป็น Global Pipe
    app.useGlobalPipes(new ValidationPipe({
        // ปรับการตั้งค่าเพิ่มเติม (แนะนำ)
        whitelist: true, // ลบ Properties ที่ไม่ได้กำหนดใน DTO ออก
        forbidNonWhitelisted: true, // โยน Error หากมี Properties ที่ไม่รู้จัก
        transform: true, // แปลงประเภทข้อมูลให้ตรงกับ DTO โดยอัตโนมัติ
    }));

    await app.listen(3000);
}
bootstrap();