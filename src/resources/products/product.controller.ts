import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { WinstonLoggerService } from 'src/common/logger/winston-logger.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';
import { imageUploadConfig } from '../../common/config/multer.config';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService,
        // private readonly logger: WinstonLoggerService
    ) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                stock: { type: 'number' },
                image: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('image', imageUploadConfig))
    async create(
        @UploadedFile() file,
        @Body() createProductDto: CreateProductDto) {
        const createProduct = await this.productService.create({ ...createProductDto, image: file ? file.filename : undefined });
        return createProduct;
    }

    @Get()
    async getAllProducts() {
        const getProduct = await this.productService.findAll()
        // this.logger.log(`Successfully retrieved ${getProduct.length} products.`); return getProduct;
    }

    @Get(':id')
    async getOneProducts(@Param('id') id: string) {
        const getProductId = await this.productService.findOne(id)
        // this.logger.log(`Successfully retrieved ${getProductId} pr `)
        return getProductId;
    }

    @Put(':id')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                stock: { type: 'number' },
                image: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('image', imageUploadConfig))
    async update(
        @Param('id') id: string,
        @Body() updateData: UpdateProductDto,
        @UploadedFile() file,
    ) {
        const updatedProduct = await this.productService.update(id, updateData, file);
        // this.logger.log(`Successfully updated product ID: ${id}`);
        return updatedProduct;
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        // console.log('Deleting product id:', id);
        return this.productService.deleteProduct(id);
    }

}