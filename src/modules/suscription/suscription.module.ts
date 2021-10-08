import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../user/user/admin.entity';
import { User } from '../user/user/user.entity';
import { SuscriptionController } from './suscription.controller';
import { Suscription } from './suscription.entity';
import { SuscriptionService } from './suscription.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Suscription]),
  ],
  controllers: [SuscriptionController],
  providers: [SuscriptionService]
})
export class SuscriptionModule { }
