import { IsString, IsOptional, IsNumber, IsInt, Min, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
    @IsNotEmpty({ message: 'Name must not be empty.' }) 
    @IsString({ message: 'Name must be a string.' })
    name: string;

    @ApiProperty({
        required: false, 
    })
    @IsOptional()
    @IsString({ message: 'Description must be a string.' })
    description?: string;

    @ApiProperty({
        example: 'Number',
    })
    @IsNotEmpty({ message: 'Price must not be empty.' }) 
    @IsNumber({}, { message: 'Price must be a number.' })
    @Type(() => Number)
    price: number;

    @ApiProperty({
        example: 'Int',
        minimum: 0, 
    })
    @IsNotEmpty({ message: 'Stock must not be empty.' })
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