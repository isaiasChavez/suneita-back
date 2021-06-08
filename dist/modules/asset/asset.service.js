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
let AssetService = class AssetService {
    constructor(adminRepository, assetRepository) {
        this.adminRepository = adminRepository;
        this.assetRepository = assetRepository;
    }
    async getAllAssetsByAdmin(uuid) {
        try {
            console.log({ uuid });
            console.log(uuid.uuid);
            const admin = await this.adminRepository.findOne({
                relations: ["assets"],
                where: {
                    uuid: uuid.uuid
                }
            });
            console.log({ admin });
            if (!admin) {
                return {
                    status: 1,
                    error: "No existe el administrador"
                };
            }
            const assets = admin.assets.filter(asset => {
                if (asset.isActive) {
                    return {
                        uuid: asset.uuid,
                        url: asset.url,
                        s: asset.isActive
                    };
                }
            });
            return {
                assets
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
            const admin = await this.adminRepository.findOne({
                where: {
                    uuid: createAssetDTO.adminUuid
                }
            });
            if (!admin) {
                return {
                    status: 1,
                    error: "No existe el administrador"
                };
            }
            const asset = this.assetRepository.create({
                admin,
                url: createAssetDTO.url
            });
            await this.assetRepository.save(asset);
            return {
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
    __param(1, typeorm_1.InjectRepository(asset_entity_1.Asset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AssetService);
exports.AssetService = AssetService;
//# sourceMappingURL=asset.service.js.map