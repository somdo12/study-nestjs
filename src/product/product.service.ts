// src/product/product.service.ts
import { Injectable, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Prisma } from '@prisma/client'


@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }
    async create(data: CreateProductDto) {
        return this.prisma.product.create({ data });
    }

    async findAll() {
        return this.prisma.product.findMany();
    }

    async findOne(id: string) {
        return this.prisma.product.findUnique({
            where: { id }
        });
    }

    async update(id: string, data: CreateProductDto) {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async deleteProduct(id: string) {
        return this.prisma.product.delete({
            where: { id },
        });
    }

}