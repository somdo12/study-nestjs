// src/auth/auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.OK) 
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Register success',
            data: {
                name: user.name,
                email: user.email,
                access_token: user.access_token,
            },
        };
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {

    const tokenPayload = await this.authService.login(dto);  
    return {
        statusCode: HttpStatus.OK,
        message: 'Login success',
        data: {
            name: tokenPayload.name,
            email: tokenPayload.email,
            access_token: tokenPayload.access_token, 
        },
    };
}
}
