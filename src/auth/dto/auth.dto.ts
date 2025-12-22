
// auth version dto-swagger

import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR'
}

// --- Register DTO ---
export class RegisterDto {
    @ApiProperty({
        description: 'อีเมลที่ใช้ในการลงทะเบียน',
        example: 'newuser@example.com',
        format: 'email',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'รหัสผ่าน (ขั้นต่ำ 6 ตัวอักษร)',
        example: 'mysecretpass',
        minLength: 6,
    })
    @IsString({ message: 'password must be is string' })
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: 'ชื่อเต็มของผู้ใช้',
        example: 'John Doe',
    })
    @IsString({ message: 'name must be is string' })
    name: string;

    @ApiProperty({
        description: 'สิทธิ์ของผู้ใช้ (เช่น USER, ADMIN)',
        required: false,
        enum: Role,
        default: Role.USER,
    })
    @IsOptional()
    @IsEnum(Role)
    role?: Role
}

// --- Login DTO ---
export class LoginDto {
    @ApiProperty({
        description: 'อีเมลที่ใช้ในการเข้าสู่ระบบ',
        example: 'user@example.com',
        format: 'email',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'รหัสผ่านของผู้ใช้',
        example: 'mysecretpass',
        required: true,
    })
    @IsString({ message: 'password must be is string' })
    @IsNotEmpty()
    password: string;

    @ApiProperty({ required: false, description: 'ไม่จำเป็นต้องใส่สำหรับ Login' })
    @IsString({ message: 'name must be is string' })
    @IsOptional()
    name: string;

    @ApiProperty({ required: false, description: 'ไม่จำเป็นต้องใส่สำหรับ Login' })
    @IsOptional()
    @IsEnum(Role)
    role?: Role
}

export { Role };