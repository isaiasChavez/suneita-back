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
const user_entity_1 = require("../user/user/user.entity");
const type_asset_entity_1 = require("./type-asset/type-asset.entity");
const user_service_1 = require("../user/user/user.service");
const imageThumbnail = require('image-thumbnail');
const Blob = require('node:buffer');
let AssetService = class AssetService {
    constructor(userService, adminRepository, userRepository, assetRepository, typeAssetRepository) {
        this.userService = userService;
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
            const { isAdmin, isGuest, user } = await this.userService.getWhoIsRequesting(getAssetDTO);
            if (!user) {
                return {
                    status: 1,
                    error: "No existe el usuario"
                };
            }
            let assets;
            if (isGuest) {
                assets = await this.assetRepository.find({
                    select: ["url", "thumbnail", "uuid"],
                    relations: ["typeAsset"],
                    where: {
                        user
                    }
                });
            }
            if (isAdmin) {
                assets = await this.assetRepository.find({
                    select: ["url", "thumbnail", "uuid"],
                    relations: ["typeAsset"],
                    where: {
                        admin: user,
                        isDeleted: false
                    }
                });
            }
            if (assets) {
                const images = assets.filter(asset => asset.typeAsset.id === this.types.IMAGE);
                const images360 = assets.filter(asset => asset.typeAsset.id === this.types.IMAGE360);
                const videos = assets.filter(asset => asset.typeAsset.id === this.types.VIDEO);
                const videos360 = assets.filter(asset => asset.typeAsset.id === this.types.VIDEO360);
                return {
                    assets: { images, videos360, videos, images360 },
                    status: 0
                };
            }
            return {
                assets: { images: [], videos360: [], videos: [], images360: [] },
                user: {
                    roomImage: user.roomImage,
                },
                status: 3,
                msg: 'there are not assets'
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
            const { isAdmin, isGuest, user } = await this.userService.getWhoIsRequesting(createAssetDTO);
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
            if (isAdmin) {
                asset = this.assetRepository.create({
                    user: null,
                    admin: user,
                    url: createAssetDTO.url,
                    thumbnail: createAssetDTO.thumbnail,
                    typeAsset
                });
            }
            if (isGuest) {
                asset = this.assetRepository.create({
                    user,
                    admin: null,
                    url: createAssetDTO.url,
                    thumbnail: createAssetDTO.thumbnail,
                    typeAsset
                });
            }
            console.log(createAssetDTO.url);
            try {
                const thumbnail = await imageThumbnail({ uri: createAssetDTO.url });
                let binary = Buffer.from(thumbnail);
                let imgData = new Blob(binary.buffer, { type: 'application/octet-binary' });
                let link = URL.createObjectURL(imgData);
                console.log({ thumbnail, link });
            }
            catch (error) {
                console.log("Error creando thumbnail", { error });
            }
            await this.assetRepository.save(asset);
            return {
                asset: {
                    url: asset.url,
                    thumbnail: asset.thumbnail,
                    typeAsset
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
            const { isAdmin, isGuest, user } = await this.userService.getWhoIsRequesting(deleteAssetDto);
            if (!user) {
                return {
                    status: 1,
                    error: "No existe el usuario"
                };
            }
            let asset;
            if (isAdmin) {
                asset = await this.assetRepository.findOne({
                    relations: ['admin', "typeAsset"],
                    where: {
                        uuid: deleteAssetDto.uuid,
                        admin: user
                    },
                });
            }
            if (isGuest) {
                asset = await this.assetRepository.findOne({
                    relations: ['admin', "typeAsset"],
                    where: {
                        uuid: deleteAssetDto.uuid,
                        user
                    },
                });
            }
            if (!asset) {
                return { status: 2, msg: 'asset not found' };
            }
            await this.assetRepository.remove(asset);
            return {
                status: 0,
                asset
            };
        }
        catch (err) {
            console.log("AssetService - delete: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error deleting asset",
            }, 500);
        }
    }
};
AssetService = __decorate([
    common_1.Injectable(),
    __param(1, typeorm_1.InjectRepository(admin_entity_1.Admin)),
    __param(2, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(3, typeorm_1.InjectRepository(asset_entity_1.Asset)),
    __param(4, typeorm_1.InjectRepository(type_asset_entity_1.TypeAsset)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssetService);
exports.AssetService = AssetService;
//# sourceMappingURL=asset.service.js.map