import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Get()
    async getAllProducts() {
        return this.productService.findAll();
    }

    @Get(':id')
    async getOneProducts(@Param('id') id: string) {
        return this.productService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() data: CreateProductDto) {
        return this.productService.update(id, data);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        console.log('Deleting product id:', id);
        return this.productService.deleteProduct(id);
    }

}