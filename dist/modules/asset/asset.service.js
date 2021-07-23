"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const admin_entity_1 = require("../user/user/admin.entity");
const asset_entity_1 = require("./asset.entity");
const types_1 = require("../../types");
const user_entity_1 = require("../user/user/user.entity");
const type_asset_entity_1 = require("./type-asset/type-asset.entity");
let AssetService = class AssetService {
    constructor(adminRepository, userRepository, assetRepository, typeAssetRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
        this.typeAssetRepository = typeAssetRepository;
        this.types = {
            IMAGE: 1,
            IMAGE360: 2,
            VIDEO: 3,
            VIDEO360: 4
        };
    }
    async getAllAssetsByUser(getAssetDTO) {
        try {
            if (!getAssetDTO.adminUuid && !getAssetDTO.userUuid) {
                return {
                    status: 5,
                    error: "No permitido"
                };
            }
            let user;
            if (getAssetDTO.type === types_1.ADMIN) {
                user = await this.adminRepository.findOne({
                    relations: ["type"],
                    where: {
                        uuid: getAssetDTO.adminUuid
                    }
                });
            }
            if (getAssetDTO.type === types_1.USER_NORMAL) {
                user = await this.userRepository.findOne({
                    relations: ["type"],
                    where: {
                        uuid: getAssetDTO.userUuid,
                        isActive: true
                    }
                });
            }
            if (!user) {
                return {
                    status: 1,
                    error: "No existe el administrador"
                };
            }
            let assets;
            if (user.type.id === types_1.USER_NORMAL) {
                assets = await this.assetRepository.find({
                    select: ["url"],
                    relations: ["typeAsset"],
                    where: {
                        user
                    }
                });
            }
            if (user.type.id === types_1.ADMIN) {
                assets = await this.assetRepository.find({
                    select: ["url"],
                    relations: ["typeAsset"],
                    where: {
                        admin: user
                    }
                });
            }
            const images = assets.filter(asset => asset.typeAsset.id === this.types.IMAGE);
            const images360 = assets.filter(asset => asset.typeAsset.id === this.types.IMAGE360);
            const videos = assets.filter(asset => asset.typeAsset.id === this.types.VIDEO);
            const videos360 = assets.filter(asset => asset.typeAsset.id === this.types.VIDEO360);
            console.log({ images, videos360, videos, images360 });
            return {
                assets: { images, videos360, videos, images360 },
                status: 0
            };
        }
        catch (err) {
            console.log("AssetService - get: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error getting assets",
            }, 500);
        }
    }
    async create(createAssetDTO) {
        try {
            if (!createAssetDTO.adminUuid && !createAssetDTO.userUuid) {
                return {
                    status: 5,
                    error: "No existe usuario"
                };
            }
            let user;
            if (createAssetDTO.type === types_1.ADMIN) {
                user = await this.adminRepository.findOne({
                    relations: ["assets"],
                    where: {
                        uuid: createAssetDTO.adminUuid
                    }
                });
            }
            if (createAssetDTO.type === types_1.USER_NORMAL) {
                user = await this.userRepository.findOne({
                    relations: ["assets"],
                    where: {
                        uuid: createAssetDTO.userUuid,
                        isActive: true
                    }
                });
            }
            if (!user) {
                return {
                    status: 1,
                    error: "No existe el usuario"
                };
            }
            const typeAsset = await this.typeAssetRepository.findOne(createAssetDTO.typeAsset);
            if (!typeAsset) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "No permitido",
                }, 403);
            }
            let asset;
            if (createAssetDTO.type === types_1.ADMIN) {
                asset = this.assetRepository.create({
                    user: null,
                    admin: user,
                    url: createAssetDTO.url,
                    typeAsset
                });
            }
            if (createAssetDTO.type === types_1.USER_NORMAL) {
                asset = this.assetRepository.create({
                    user,
                    admin: null,
                    url: createAssetDTO.url,
                    typeAsset
                });
            }
            await this.assetRepository.save(asset);
            return {
                asset: {
                    url: asset.url
                },
                status: 0
            };
        }
        catch (err) {
            console.log("AssetService - create: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error creating asset",
            }, 500);
        }
    }
    async delete(deleteAssetDto) {
        try {
            const admin = await this.adminRepository.findOne({
                where: {
                    uuid: deleteAssetDto.adminUuid
                }
            });
            if (!admin) {
                return {
                    status: 1,
                    error: "No existe el administrador"
                };
            }
            const asset = await this.assetRepository.findOne({
                relations: ['admin'],
                where: {
                    uuid: deleteAssetDto.uuid
                },
            });
            if (!asset) {
                return { status: 2, msg: 'asset not found' };
            }
            if (asset.admin.id !== admin.id) {
                return { status: 2, msg: 'Unauthorized' };
            }
            await this.assetRepository.remove(asset);
            return;
        }
        catch (err) {
            console.log("AssetService - invite: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error deleting asset",
            }, 500);
        }
    }
};
AssetService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(admin_entity_1.Admin)),
    __param(1, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(2, typeorm_1.InjectRepository(asset_entity_1.Asset)),
    __param(3, typeorm_1.InjectRepository(type_asset_entity_1.TypeAsset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssetService);
exports.AssetService = AssetService;
//# sourceMappingURL=asset.service.js.map