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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAssetDto = exports.CreateAssetDTO = exports.GetAssetDTO = void 0;
const class_validator_1 = require("class-validator");
class GetAssetDTO {
    constructor({ adminUuid, userUuid, type }) {
        this.adminUuid = adminUuid;
        this.userUuid = userUuid;
        this.type = type;
    }
}
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], GetAssetDTO.prototype, "userUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], GetAssetDTO.prototype, "adminUuid", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", Number)
], GetAssetDTO.prototype, "type", void 0);
exports.GetAssetDTO = GetAssetDTO;
class CreateAssetDTO {
    constructor({ adminUuid, userUuid, url, type, typeAsset }) {
        this.adminUuid = adminUuid;
        this.userUuid = userUuid;
        this.url = url;
        this.type = type;
        this.typeAsset = typeAsset;
    }
}
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CreateAssetDTO.prototype, "userUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateAssetDTO.prototype, "adminUuid", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsUrl(),
    __metadata("design:type", String)
], CreateAssetDTO.prototype, "url", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], CreateAssetDTO.prototype, "typeAsset", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], CreateAssetDTO.prototype, "type", void 0);
exports.CreateAssetDTO = CreateAssetDTO;
class DeleteAssetDto {
    constructor({ adminUuid, uuid }) {
        this.adminUuid = adminUuid;
        this.uuid = uuid;
    }
}
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], DeleteAssetDto.prototype, "adminUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], DeleteAssetDto.prototype, "uuid", void 0);
exports.DeleteAssetDto = DeleteAssetDto;
//# sourceMappingURL=asset.dto.js.map