
// auth version dto-swagger

import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // นำเข้า ApiProperty
import { Role } from '@prisma/client'; // สมมติว่า Role คือ 'USER' | 'ADMIN'

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
        minLength: 6, // แสดง MinLength ใน Swagger
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
        required: false, // ตรงกับ @IsOptional()
        enum: Role, // แสดงตัวเลือก Enum ใน Swagger
        default: Role.USER, // กำหนดค่าเริ่มต้นถ้ามี
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
        required: true, // ตรงกับ @IsNotEmpty()
    })
    @IsString({ message: 'password must be is string' })
    @IsNotEmpty()
    password: string;

    // ส่วนนี้ถูกกำหนดใน Register แต่ไม่จำเป็นสำหรับการ Login
    // แนะนำให้ตัดออก ถ้า Login API ไม่ได้ใช้
    @ApiProperty({ required: false, description: 'ไม่จำเป็นต้องใส่สำหรับ Login' })
    @IsString({ message: 'name must be is string' })
    @IsOptional()
    name: string;

    // ส่วนนี้ถูกกำหนดใน Register แต่ไม่จำเป็นสำหรับการ Login
    // แนะนำให้ตัดออก ถ้า Login API ไม่ได้ใช้
    @ApiProperty({ required: false, description: 'ไม่จำเป็นต้องใส่สำหรับ Login' })
    @IsOptional()
    @IsEnum(Role)
    role?: Role
}