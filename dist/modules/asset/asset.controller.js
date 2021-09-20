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
exports.AssetController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const user_dto_1 = require("../user/user/user.dto");
const asset_dto_1 = require("./asset.dto");
const asset_service_1 = require("./asset.service");
let AssetController = class AssetController {
    constructor(assetService) {
        this.assetService = assetService;
    }
    async getAllAssetsByUser(getAssetDTO) {
        try {
            return await this.assetService.getAllAssetsByUser(getAssetDTO);
        }
        catch (error) {
            return error;
        }
    }
    async create(createAssetDTO) {
        let newcreateAssetDTO = new asset_dto_1.CreateAssetDTO(createAssetDTO);
        try {
            await class_validator_1.validateOrReject(newcreateAssetDTO);
            return await this.assetService.create(newcreateAssetDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            };
        }
    }
    async delete(deleteAssetDTO) {
        console.log({ deleteAssetDTO });
        let newdeleteAssetDTO = new asset_dto_1.DeleteAssetDto(deleteAssetDTO);
        try {
            await class_validator_1.validateOrReject(newdeleteAssetDTO);
            return await this.assetService.delete(newdeleteAssetDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            };
        }
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.SimpleRequest]),
    __metadata("design:returntype", Promise)
], AssetController.prototype, "getAllAssetsByUser", null);
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [asset_dto_1.CreateAssetDTO]),
    __metadata("design:returntype", Promise)
], AssetController.prototype, "create", null);
__decorate([
    common_1.Put(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [asset_dto_1.DeleteAssetDto]),
    __metadata("design:returntype", Promise)
], AssetController.prototype, "delete", null);
AssetController = __decorate([
    common_1.Controller('asset'),
    __metadata("design:paramtypes", [asset_service_1.AssetService])
], AssetController);
exports.AssetController = AssetController;
//# sourceMappingURL=asset.controller.js.map