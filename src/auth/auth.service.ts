import {
    Injectable,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, Role } from './dto/auth.dto';

@Injectable()
export class AuthService {
    private readonly SALT_ROUNDS = 10; 
    private readonly JWT_CONFIG = { 
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
    } as const;

    constructor(
        private readonly prisma: PrismaService, 
        private readonly jwt: JwtService,   
    ) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
    }

    async register(dto: RegisterDto) {
        await this.validateUniqueEmail(dto.email);

        try {
            const hashedPassword = await this.hashPassword(dto.password); 
            const user = await this.prisma.user.create({
                data: {
                    email: this.normalizeEmail(dto.email), 
                    password: hashedPassword,
                    name: dto.name,
                    role: dto.role || 'USER',
                },
                // ສົ່ງ res data ກັບມາໃຫ້ for user
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                },
            });

            // ສ້າງ JWT Token
            return this.generateAuthResponse(
                user.id,
                user.email,
                user.name,
                user.role,
            );
        } catch (error) {
            this.handlePrismaError(error); 
        }
    }

    async login(dto: LoginDto) {
        const normalizedEmail = this.normalizeEmail(dto.email);
        const user = await this.prisma.user.findFirst({
            where: {
                email: {
                    equals: normalizedEmail,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                role: true,
            },
        });
        if (!user) {
            throw new ForbiddenException('Invalid credentials');
        }
        const isPasswordValid = await this.verifyPassword(
            dto.password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new ForbiddenException('Invalid credentials');
        }

        return this.generateAuthResponse(
            user.id,
            user.email,
            user.name,
            user.role,
        );
    }

    private async validateUniqueEmail(email: string): Promise<void> {
        const normalizedEmail = this.normalizeEmail(email);
        const existingUser = await this.prisma.user.findFirst({
            where: {
                email: {
                    equals: normalizedEmail,
                    mode: 'insensitive',
                },
            },
        });
        if (existingUser) {
            throw new ConflictException(
                `Email '${email}' is already registered`,
            );
        }
    }

    private normalizeEmail(email: string): string {
        return email.toLowerCase().trim();
    }

    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    private async verifyPassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }


    private async generateAuthResponse(
        userId: string,
        email: string,
        name: string | null,
        role: string,
    ) {
        const payload = {
            sub: userId,
            email,
            name: name ?? '',
            role,
        };
        const accessToken = await this.jwt.signAsync(payload, this.JWT_CONFIG);
        return {
            access_token: accessToken,
            email,
            name: name ?? '',
            role,
        };
    }

    private handlePrismaError(error: unknown): never {
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            throw new ConflictException('Email already in use');
        }
        throw error;
    }
}