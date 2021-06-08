import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../user/user/admin.entity';
import { AssetController } from './asset.controller';
import { Asset } from './asset.entity';
import { AssetService } from './asset.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    TypeOrmModule.forFeature([Asset]),
  ],
  controllers: [AssetController],
  providers: [AssetService]
})
export class AssetModule { }
