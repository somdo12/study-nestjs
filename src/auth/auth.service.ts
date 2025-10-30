// src/auth/auth.service.ts
import { Injectable, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) { }

async register(dto: RegisterDto) {
    try {
        const hash = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hash,
                name :dto.name
            },
            select: {
                id: true,
                email: true,
                name: true, 
            }
        });

        // จัดการค่า name ที่อาจเป็น null (ถ้าฟิลด์ name เป็น Optional)
        const userName = user.name || ''; 

        // ✅ แก้ไข: ส่ง 'name' เข้าไปใน signToken
        return this.signToken(user.id, user.email, userName); 
        
    } catch (error) {
        // ... (Error Handling P2002) ...
        // เพื่อให้โค้ดสมบูรณ์:
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new ConflictException('Email already in use');
        }
        throw error;
    }
}
    // src/auth/auth.service.ts
    //logic login service

    async login(dto: LoginDto): Promise<{ access_token: string, email: string, name: string }> {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { id: true, email: true, password: true, name: true }
        });

        // 403 Forbidden: ผู้ใช้ไม่พบ
        if (!user) throw new ForbiddenException('Invalid credentials');

        // ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(dto.password, user.password);

        // 403 Forbidden: รหัสผ่านไม่ถูกต้อง
        if (!isMatch) throw new ForbiddenException('Invalid credentials');

        // จัดการค่า name ที่อาจเป็น null (ถ้าใน Prisma schema เป็น Optional)
        const userName = user.name || ''; // userName เป็น string

        // ✅ แก้ไข: ส่งแค่ userName (ซึ่งเป็น string) ไปยัง signToken
        return this.signToken(user.id, user.email, userName);
    }

    // 3. **signToken**: โค้ดดีอยู่แล้ว แต่ควรมั่นใจว่าใช้ 'sub' และ 'email'
    async signToken(userId: string, email: string, name: string):
        Promise<{ access_token: string, email: string, name: string }> {
        const payload = { sub: userId, email, name };
        const token = await this.jwt.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1d',
        });
        return {
            access_token: token,
            email: email,
            name: name
        };
    }
}
