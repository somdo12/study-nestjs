// // dto/create-product.dto.ts
// import { IsString, IsOptional, IsNumber, IsInt, Min } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';
// //validtion Product
// export class CreateProductDto {
//     @ApiProperty({
//         description: 'Name for create product must be is string ',
//         example: '"beer laos"',
//     })
//     @IsString({ message: 'description must be is string' })
//     name: string;

//     @IsOptional()
//     @IsString({ message: 'description must be is string' })
//     description?: string;

//     @IsNumber({}, { message: 'price must be in numbers only.' })
//     price: number;

//     @IsInt()
//     @Min(0, { message: "The stock quantity must not be less than 0." })
//     stock: number;
// }
// dto/create-product.dto.ts (สมบูรณ์ขึ้น)

import { IsString, IsOptional, IsNumber, IsInt, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({
        description: 'ชื่อผลิตภัณฑ์',
        // example: 'Beer Lao Original',
    })
    @IsNotEmpty({ message: 'Name must not be empty.' }) // เพิ่ม: ห้ามว่าง
    @IsString({ message: 'Name must be a string.' })
    name: string;

    @ApiProperty({
        description: 'คำอธิบายสินค้า (ไม่บังคับ)',
        required: false, // ระบุใน Swagger ว่าไม่บังคับ
    })
    @IsOptional()
    @IsString({ message: 'Description must be a string.' })
    description?: string;

    @ApiProperty({
        description: 'ราคาสินค้า',
        example: 'Number',
    })
    @IsNotEmpty({ message: 'Price must not be empty.' }) // เพิ่ม: ห้ามว่าง
    @IsNumber({}, { message: 'Price must be a number.' })
    price: number;

    @ApiProperty({
        description: 'จำนวนสินค้าในคลัง',
        example: 'Int',
        minimum: 0, // แสดงข้อจำกัด @Min(0) ใน Swagger
    })
    @IsNotEmpty({ message: 'Stock must not be empty.' }) // เพิ่ม: ห้ามว่าง
    @IsInt()
    @Min(0, { message: "The stock quantity must not be less than 0." })
    stock: number;
}