import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Token])],
})
export class TokenModule { }
