import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suscription } from '../suscription/suscription.entity';
import { SuscriptionService } from '../suscription/suscription.service';
import { Invitation } from '../user/invitation/invitation.entity';
import { Role } from '../user/role/role.entity';
import { Sesion } from '../user/sesion/sesion.entity';
import { Status } from '../user/status/status.entity';
import { Token } from '../user/token/token.entity';
import { Type } from '../user/type/type.entity';
import { Admin } from '../user/user/admin.entity';
import { SuperAdmin } from '../user/user/superadmin.entity';
import { User } from '../user/user/user.entity';
import { UserService } from '../user/user/user.service';
import { AssetController } from './asset.controller';
import { Asset } from './asset.entity';
import { AssetService } from './asset.service';
import { TypeAsset } from './type-asset/type-asset.entity';
import { TypeAssetModule } from './type-asset/type-asset.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    TypeOrmModule.forFeature([Asset]),
    TypeOrmModule.forFeature([TypeAsset]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([SuperAdmin]),
    TypeOrmModule.forFeature([Suscription]),
    TypeOrmModule.forFeature([Token]),
    TypeOrmModule.forFeature([Type]),
    TypeOrmModule.forFeature([Role]),
    TypeOrmModule.forFeature([Sesion]),
    TypeOrmModule.forFeature([Invitation]),
    TypeOrmModule.forFeature([Status]),
    TypeAssetModule,
  ],
  controllers: [AssetController],
  providers: [AssetService,UserService,SuscriptionService]
})
export class AssetModule { }
