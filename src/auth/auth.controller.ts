// src/auth/auth.controller.ts 
import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

// Interface สำหรับ API Response
interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

interface AuthData {
    name: string;
    email: string;
    access_token: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * ลงทะเบียนผู้ใช้ใหม่
     * จำกัด 3 ครั้งต่อนาที
     */
    @Post('register')
    @ApiOperation({ summary: 'สร้างบัญชีผู้ใช้ใหม่' })
    @ApiBody({ type: RegisterDto })
    @HttpCode(HttpStatus.CREATED)
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    async register(@Body() dto: RegisterDto): Promise<ApiResponse<AuthData>> {
        const authResponse = await this.authService.register(dto);
        return this.buildSuccessResponse(
            HttpStatus.CREATED,
            'User registered successfully',
            authResponse,
        );
    }

    /**
     * เข้าสู่ระบบ
     * จำกัด 5 ครั้งต่อนาที
     */
    @Post('login')
    @ApiOperation({ summary: 'เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'ล็อกอินสำเร็จ', /* type: AuthTokenDto */ })
    @ApiResponse({ status: 401, description: 'ไม่ได้รับอนุญาต (Unauthorized)' })
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    async login(@Body() dto: LoginDto): Promise<ApiResponse<AuthData>> {
        const authResponse = await this.authService.login(dto);
        return this.buildSuccessResponse(
            HttpStatus.OK,
            'Login successful',
            authResponse,
        );
    }

    /**
     * สร้าง success response ในรูปแบบมาตรฐาน
     */
    private buildSuccessResponse<T>(
        statusCode: number,
        message: string,
        data: T,
    ): ApiResponse<T> {
        return {
            statusCode,
            message,
            data,
        };
    }
}