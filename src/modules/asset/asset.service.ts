import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../user/user/admin.entity';
import { CreateAssetDTO, DeleteAssetDto, GetAssetDTO } from './asset.dto';
import { Asset } from './asset.entity';
import { ADMIN, SUPER_ADMIN,USER_NORMAL } from 'src/types';
import { SuperAdmin } from '../user/user/superadmin.entity';
import { User } from '../user/user/user.entity';
import { TypeAsset } from './type-asset/type-asset.entity';

@Injectable()
export class AssetService {

    constructor(
        @InjectRepository(Admin) private adminRepository: Repository<Admin>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Asset) private assetRepository: Repository<Asset>,
        @InjectRepository(TypeAsset) private typeAssetRepository: Repository<TypeAsset>,
    ) {
    }

    async getAllAssetsByUser(getAssetDTO: GetAssetDTO): Promise<any> {
        try {

            if (!getAssetDTO.adminUuid && !getAssetDTO.userUuid) {
                return {
                    status: 5,
                    error: "No permitido"
                }
            }

            let user: User | Admin
            if (getAssetDTO.type === ADMIN ) {
                 user = await this.adminRepository.findOne({
                     relations: ["type"],
                    where: {
                        uuid:getAssetDTO.adminUuid
                    }
                })
            }
            if (getAssetDTO.type ===  USER_NORMAL) {
                user = await this.userRepository.findOne({
                    relations: ["type"],
                   where: {
                       uuid: getAssetDTO.userUuid,
                       isActive:true
                   }
               })
           }

            if (!user) {
                return {
                    status: 1,
                    error: "No existe el administrador"
                }
            }
            let assets:Asset[]
            if (user.type.id === USER_NORMAL) {
                assets = await this.assetRepository.find({
                    select: ["url"],
                    relations:["typeAsset"],
                    where: {
                        user
                }})
            }
            if (user.type.id === ADMIN) {
                assets = await this.assetRepository.find({
                    select: ["url"],
                    relations:["typeAsset"],
                    where: {
                        admin:user
                }})
            }




            return {
                assets,
                status:0
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

            if (!createAssetDTO.adminUuid && !createAssetDTO.userUuid) {
                return {
                    status: 5,
                    error: "No existe usuario"
                }
            }

            let user: User | Admin
            if (createAssetDTO.type === ADMIN ) {
                 user = await this.adminRepository.findOne({
                    relations: ["assets"],
                    where: {
                        uuid:createAssetDTO.adminUuid
                    }
                })
            }
            if (createAssetDTO.type ===  USER_NORMAL) {
                user = await this.userRepository.findOne({
                   relations: ["assets"],
                   where: {
                       uuid: createAssetDTO.userUuid,
                       isActive:true
                   }
               })
           }

            if (!user) {
                return {
                    status: 1,
                    error: "No existe el usuario"
                }
            }

            const typeAsset =await this.typeAssetRepository.findOne(createAssetDTO.typeAsset)
            if (!typeAsset) {
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: "No permitido",
                    },
                    403
                );  
            }
            let asset:Asset
            if (createAssetDTO.type === ADMIN ) {
                asset = this.assetRepository.create({
                    user:null,
                    admin:user,
                    url: createAssetDTO.url,
                    typeAsset
                })
           }
           if (createAssetDTO.type ===  USER_NORMAL) {
            asset = this.assetRepository.create({
                user,
                admin:null,
                url: createAssetDTO.url,
                typeAsset
            })
          }
            
            await this.assetRepository.save(asset)
            return {
                asset: {
                    url:asset.url
                },
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
