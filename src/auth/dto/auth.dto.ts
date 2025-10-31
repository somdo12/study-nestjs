// src/auth/dto/auth.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString({message : 'password must be is string'})
    @MinLength(6)
    password: string;

    @IsString({message : 'name must be is string'})
    name: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString({message : 'password must be is string'})
    @IsNotEmpty()
    password: string;

    @IsString({message : 'name must be is string'})
    @IsOptional()
    name: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role
}
