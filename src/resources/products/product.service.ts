// src/product/product.service.ts
import { Injectable, } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';


@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }
    async create(data: CreateProductDto) {
        return await this.prisma.product.create({ data });
    }

    async findAll() {
        return this.prisma.product.findMany();
    }

    async findOne(id: string) {
        return this.prisma.product.findUnique({
            where: { id }
        });
    }
    // product.service.ts
    async update(id: string, updateData: Partial<CreateProductDto>) {
        await this.findOne(id);
        return await this.prisma.product.update({
            where: { id },
            data: updateData,
        });
    }

    async deleteProduct(id: string) {
        return this.prisma.product.delete({
            where: { id },
        });
    }
    async addImage(productId: string, imageFilename: string) {
        const product = await this.findOne(productId);

        return await this.prisma.product.update({
            where: { id: productId },
            data: {
                images: {
                    push: imageFilename, 
                },
            },
        });
    }

    async setMainImage(productId: string, imageFilename: string) {
        return await this.prisma.product.update({
            where: { id: productId },
            data: {
                image: imageFilename,
            },
        });
    }

}