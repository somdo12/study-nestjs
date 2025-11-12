import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { WinstonLoggerService } from 'src/common/logger/winston-logger.service';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService,
        private readonly logger: WinstonLoggerService
    ) { }

    @Post()
    async create(@Body() createProductDto: CreateProductDto) {
        const createProduct = await this.productService.create(createProductDto)
        this.logger.log(createProduct)
        return createProduct;
    }

    @Get()
    async getAllProducts() {
        // this.logger.log('Fetching all products...');
        const getProduct = await this.productService.findAll()
        this.logger.log(`Successfully retrieved ${getProduct.length} products.`); return getProduct;
    }

    @Get(':id')
    async getOneProducts(@Param('id') id: string) {
        const getProductId = await this.productService.findOne(id)
        this.logger.log(`Successfully retrieved ${getProductId} pr `)
        return getProductId ;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: CreateProductDto) {
        return this.productService.update(id, data);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        console.log('Deleting product id:', id);
        return this.productService.deleteProduct(id);
    }

}