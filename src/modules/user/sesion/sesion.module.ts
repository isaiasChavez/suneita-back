import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesionController } from './sesion.controller';
import { SesionService } from './sesion.service';
import { Sesion } from './sesion.entity';
import { User } from '../user/user.entity';
import { Admin } from '../user/admin.entity';
import { SuperAdmin } from '../user/superadmin.entity';
import { Type } from '../type/type.entity';
import { Token } from '../token/token.entity';
import { Invitation } from '../invitation/invitation.entity';
import { Role } from '../role/role.entity';
import { Suscription } from 'src/modules/suscription/suscription.entity';
import { Asset } from 'src/modules/asset/asset.entity';
import { UserService } from '../user/user.service';
import { SuscriptionService } from 'src/modules/suscription/suscription.service';
import { Status } from '../status/status.entity';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sesion]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Admin]),
    TypeOrmModule.forFeature([SuperAdmin]),
    TypeOrmModule.forFeature([Type]),
    TypeOrmModule.forFeature([Token]),
    TypeOrmModule.forFeature([Invitation]),
    TypeOrmModule.forFeature([Role]),
    TypeOrmModule.forFeature([Suscription]),
    TypeOrmModule.forFeature([Asset]),
    TypeOrmModule.forFeature([Status]),
    

  ],
  controllers: [SesionController],
  providers: [SesionService,UserService,SuscriptionService,ConfigService],
})
export class SesionModule {}
