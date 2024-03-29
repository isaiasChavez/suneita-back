import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Token } from '../token/token.entity';
import { Type } from '../type/type.entity';
import { Role } from '../role/role.entity';
import { Sesion } from '../sesion/sesion.entity';
import { SuperAdmin } from './superadmin.entity';
import { Admin } from './admin.entity';
import { Suscription } from 'src/modules/suscription/suscription.entity';
import { Invitation } from '../invitation/invitation.entity';
import { Asset } from 'src/modules/asset/asset.entity';
import { SuscriptionService } from 'src/modules/suscription/suscription.service';
import { Status } from '../status/status.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([SuperAdmin]),
    TypeOrmModule.forFeature([Admin]),
    TypeOrmModule.forFeature([Suscription]),
    TypeOrmModule.forFeature([Token]),
    TypeOrmModule.forFeature([Type]),
    TypeOrmModule.forFeature([Role]),
    TypeOrmModule.forFeature([Sesion]),
    TypeOrmModule.forFeature([Invitation]),
    TypeOrmModule.forFeature([Asset]),
    TypeOrmModule.forFeature([Status]),
  ],
  controllers: [UserController],
  providers: [UserService,SuscriptionService],
})
export class UserModule {}
