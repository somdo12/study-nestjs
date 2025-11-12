import { LoggerService, Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class WinstonLoggerService implements LoggerService {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info', // กำหนดระดับ Log เริ่มต้น (เช่น info, warn, error)
            
            format: winston.format.json(), // บันทึก Log ในรูปแบบ JSON
            transports: [
                // 1. Transport สำหรับ Console (แสดงใน Terminal)
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize(),
                        winston.format.simple(), // ทำให้ Log ใน Console อ่านง่ายขึ้น
                    ),
                }),
                // 2. Transport สำหรับ File (บันทึกเป็นไฟล์)
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error', // บันทึกเฉพาะ Log ระดับ error ขึ้นไป
                }),
                new winston.transports.File({
                    filename: 'logs/combined.log',
                }),
            ],
        });
    }

    log(message: any, context?: string) {
        this.logger.info(message, { context });
    }

    error(message: any, trace?: string, context?: string) {
        this.logger.error(message, { trace, context });
    }

    warn(message: any, context?: string) {
        this.logger.warn(message, { context });
    }

    debug(message: any, context?: string) {
        this.logger.debug(message, { context });
    }

    verbose(message: any, context?: string) {
        this.logger.verbose(message, { context });
    }
}