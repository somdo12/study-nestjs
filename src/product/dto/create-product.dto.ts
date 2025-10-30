// dto/create-product.dto.ts
import { IsString, IsOptional, IsNumber, IsInt, Min } from 'class-validator';
//validtion Product
export class CreateProductDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber({},{ message:'price must be in numbers only.'})
    price: number;

    @IsInt()
    @Min(0,{message:"The stock quantity must not be less than 0."})
    stock: number;
}
