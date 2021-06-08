import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../user/user/admin.entity';
import { CreateAssetDTO, DeleteAssetDto } from './asset.dto';
import { Asset } from './asset.entity';

@Injectable()
export class AssetService {

    constructor(
        @InjectRepository(Admin) private adminRepository: Repository<Admin>,
        @InjectRepository(Asset) private assetRepository: Repository<Asset>,
    ) {
    }

    async getAllAssetsByAdmin(uuid): Promise<any> {
        try {
            console.log({ uuid })
            console.log(uuid.uuid)
            const admin = await this.adminRepository.findOne({
                relations: ["assets"],
                where: {
                    uuid: uuid.uuid
                }
            })
            console.log({ admin })

            if (!admin) {
                return {
                    status: 1,
                    error: "No existe el administrador"
                }
            }

            const assets = admin.assets.filter(asset => {
                if (asset.isActive) {
                    return {
                        uuid: asset.uuid,
                        url: asset.url,
                        s: asset.isActive
                    }
                }
            })
            return {
                assets
            }
        } catch (err) {
            console.log("AssetService - get: ", err);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error getting assets",
                },
                500
            );
        }
    }


    async create(createAssetDTO: CreateAssetDTO): Promise<any> {
        try {
            const admin = await this.adminRepository.findOne({
                where: {
                    uuid: createAssetDTO.adminUuid
                }
            })
            if (!admin) {
                return {
                    status: 1,
                    error: "No existe el administrador"
                }
            }
            const asset = this.assetRepository.create({
                admin,
                url: createAssetDTO.url
            })
            await this.assetRepository.save(asset)
            return {
                status: 0
            }
        } catch (err) {
            console.log("AssetService - create: ", err);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error creating asset",
                },
                500
            );
        }
    }
    async delete(deleteAssetDto: DeleteAssetDto): Promise<any> {
        try {
            const admin = await this.adminRepository.findOne({
                where: {
                    uuid: deleteAssetDto.adminUuid
                }
            })
            if (!admin) {
                return {
                    status: 1,
                    error: "No existe el administrador"
                }
            }
            const asset = await this.assetRepository.findOne({
                relations: ['admin'],
                where: {
                    uuid: deleteAssetDto.uuid
                },
            })
            if (!asset) {
                return { status: 2, msg: 'asset not found' };
            }
            if (asset.admin.id !== admin.id) {
                return { status: 2, msg: 'Unauthorized' };
            }

            await this.assetRepository.remove(asset)
            return
        } catch (err) {
            console.log("AssetService - invite: ", err);

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Error deleting asset",
                },
                500
            );
        }
    }



}
