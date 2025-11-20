import { IsString, IsOptional, IsNumber, IsInt, Min, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({ description: 'ชื่อผลิตภัณฑ์', })
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
    @Type(() => Number)
    price: number;

    @ApiProperty({
        description: 'จำนวนสินค้าในคลัง',
        example: 'Int',
        minimum: 0, // แสดงข้อจำกัด @Min(0) ใน Swagger
    })
    @IsNotEmpty({ message: 'Stock must not be empty.' }) // เพิ่ม: ห้ามว่าง
    @IsInt()
    @Min(0, { message: "The stock quantity must not be less than 0." })
    @Type(() => Number)
    stock: number;

    @ApiProperty({ example: 'image-123456.jpg', required: false })
    @IsString()
    @IsOptional()
    image?: string;

    @ApiProperty({
        example: ['image-1.jpg', 'image-2.jpg'],
        required: false,
        type: [String]
    })
    @IsArray()
    @IsOptional()
    images?: string[];
}