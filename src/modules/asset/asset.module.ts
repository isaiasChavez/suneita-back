import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../user/user/admin.entity';
import { User } from '../user/user/user.entity';
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
    TypeAssetModule,
  ],
  controllers: [AssetController],
  providers: [AssetService]
})
export class AssetModule { }
