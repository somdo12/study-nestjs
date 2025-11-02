// src/prisma/prisma.module.ts ໄຟລຈັດການ PrismaService export ໃຫ້ modules ອື່ນໃຊ້
import { Module,Global } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Global()
@Module({
  providers: [PrismaService], // กำหนดให้ PrismaService เป็น Provider
  exports: [PrismaService], // Export ออกไปเพื่อให้ Module อื่นใช้ได้
})
export class PrismaModule {}