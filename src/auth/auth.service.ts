// src/auth/auth.service.ts
import {
    Injectable,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

// ກຳນົດ interface AuthResponse 
interface AuthResponse {
    access_token: string;
    email: string;
    name: string;
    role: Role;
}

@Injectable()
export class AuthService {
    private readonly SALT_ROUNDS = 10; //ຈຳນວນຮອບການ hash password
    private readonly JWT_CONFIG = { 
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
    } as const;

    constructor(
        private readonly prisma: PrismaService, // ຕິດຕໍ່ຖານຂໍ້ມູນ
        private readonly jwt: JwtService,   // ສ້າງ JWT token
    ) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
    }


    //  Method register 

    async register(dto: RegisterDto): Promise<AuthResponse> {
        //  ກວດສອບ email ຊ້ຳກັນ ຖ້າມີສົ່ງ err 409: "Email 'Name Email is already registered : ບອກ user ວ່າເມວຊ້ຳ"
        await this.validateUniqueEmail(dto.email);

        try {
            // Hash password ໂດຍການເອີ້ນໃໍຊ້ Method hashPassword ທີ່ສ້າງໄວ້ໃນຂ້າງລຸ່ມໃນໄຟລນີ້
            const hashedPassword = await this.hashPassword(dto.password); 

            const user = await this.prisma.user.create({
                data: {
                    email: this.normalizeEmail(dto.email), //ປ່ຽນ email ເປັນໂຕພິມນ້ອຍ
                    password: hashedPassword,
                    name: dto.name,
                    role: dto.role || Role.USER,
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
            this.handlePrismaError(error); // ຈັດການ error
        }
    }

    /**
     * เข้าสู่ระบบ
     */
    async login(dto: LoginDto): Promise<AuthResponse> {
        // ຫາ user ຈາກ email 
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
        // ຖ້າບໍ່ມີຂໍ້ມູນໃນຖານ ຈະ return Error:'Invalid credentials'
        if (!user) {
            throw new ForbiddenException('Invalid credentials');
        }
        // ກວດສອບລະຫັດຜ່ານໂດຍເອີ້ນໃຊ້ Method verifyPassword
        const isPasswordValid = await this.verifyPassword(
            dto.password,
            user.password,
        );
        // ກວດສອບລະຫັດຜ່ານ ຖ້າບໍ່ມີຈະສົ່ງ Error:'Invalid credentials'
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

    /**
     * ตรวจสอบว่า email นี้ถูกใช้ไปแล้วหรือยัง
     */
    private async validateUniqueEmail(email: string): Promise<void> {
        const normalizedEmail = this.normalizeEmail(email);
        // ຊອກຫາວ່າມີ user ທີ່ໃໍຊ້ email ນີ້ບໍ່
        const existingUser = await this.prisma.user.findFirst({
            where: {
                email: {
                    equals: normalizedEmail,
                    mode: 'insensitive',
                },
            },
        });
        // ຖ້າເຫັນ ອີເມວ ຊ້ຳ
        if (existingUser) {
            throw new ConflictException(
                `Email '${email}' is already registered`,
            );
        }
    }

    /**
     * Method ສຳຫຼັບ ແປງ email ມາເປັນໂຕນ້ອຍ ແລະ ໃຫ່ຍ trim(ໜ້າ, ຫຼັງ) whitespace
     */
    private normalizeEmail(email: string): string {
        return email.toLowerCase().trim();
    }

    /**
     * Method ສຳຫຼັບ Hash password 
     */
    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    /**
     * Method ສຳຫຼັບ ກວດສອບລະຫັດຜ່ານ
     */
    private async verifyPassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    /**
     * ສ້າງ JWT token และ return response
     */
    private async generateAuthResponse(
        userId: string,
        email: string,
        name: string | null,
        role: Role,
    ): Promise<AuthResponse> {
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

    /**
     * จัดการ Prisma errors
     */
    private handlePrismaError(error: unknown): never {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            throw new ConflictException('Email already in use');
        }
        throw error;
    }
}