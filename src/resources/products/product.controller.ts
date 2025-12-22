import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { WinstonLoggerService } from 'src/common/logger/winston-logger.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import * as path from 'path';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService,
        private readonly logger: WinstonLoggerService
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
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/images',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    }))
    async create(
        @UploadedFile() file,
        @Body() createProductDto: CreateProductDto) {
        console.log('Upload file:', file);
        console.log('Product data:', createProductDto);
        const createProduct = await this.productService.create({ ...createProductDto, image: file ? file.filename : undefined });
        this.logger.log(createProduct)
        return createProduct;
    }

    @Get()
    async getAllProducts() {
        const getProduct = await this.productService.findAll()
        this.logger.log(`Successfully retrieved ${getProduct.length} products.`); return getProduct;
    }

    @Get(':id')
    async getOneProducts(@Param('id') id: string) {
        const getProductId = await this.productService.findOne(id)
        this.logger.log(`Successfully retrieved ${getProductId} pr `)
        return getProductId;
    }

    @Put(':id')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/images',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = path.extname(file.originalname);
                    callback(null, `product-${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    return callback(
                        new BadRequestException('Only image files are allowed!'),
                        false,
                    );
                }
                callback(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    async update(
        @Param('id') id: string,
        @Body() updateData: UpdateProductDto,
        @UploadedFile() file,
    ) {
        if (file) {
            updateData.image = file.filename;
        }
        return await this.productService.update(id, updateData);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        console.log('Deleting product id:', id);
        return this.productService.deleteProduct(id);
    }

}