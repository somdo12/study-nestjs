// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // 🔑 นี่คือส่วนสำคัญ: การใช้ ValidationPipe เป็น Global Pipe
    app.useGlobalPipes(new ValidationPipe({
        // ปรับการตั้งค่าเพิ่มเติม 
        whitelist: true,
        forbidNonWhitelisted: true, 
        transform: true, 
    }));
    await app.listen(3000);
}
bootstrap();