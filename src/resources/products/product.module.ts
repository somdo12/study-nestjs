import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../../prisma/prisma.service';
import { WinstonLoggerService } from 'src/common/logger/winston-logger.service';

@Module({
    controllers: [ProductController],
    providers: [ProductService, PrismaService, WinstonLoggerService],

})
export class ProductModule { }
