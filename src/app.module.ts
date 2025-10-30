import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';  
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule, 
    ProductModule,
    AuthModule  
  ],
})
export class AppModule {}