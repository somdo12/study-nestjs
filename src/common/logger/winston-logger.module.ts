import { Module } from '@nestjs/common';
import { WinstonLoggerService } from './winston-logger.service';

@Module({
    providers: [WinstonLoggerService],
    exports: [WinstonLoggerService], // ต้อง Export Service เพื่อนำไปใช้ใน Module อื่น
})
export class WinstonLoggerModule { }