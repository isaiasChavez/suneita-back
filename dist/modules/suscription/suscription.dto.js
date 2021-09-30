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
exports.DeleteSuscriptionSuscriptionDTO = exports.AddNewSuscriptionSuscriptionDTO = exports.UpdateSuscriptionDTO = void 0;
const class_validator_1 = require("class-validator");
const user_dto_1 = require("../user/user/user.dto");
class UpdateSuscriptionDTO {
    constructor({ adminUuid, startedAt, finishedAt, cost, business }) {
        this.adminUuid = adminUuid;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.cost = cost;
        this.business = business;
    }
}
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateSuscriptionDTO.prototype, "adminUuid", void 0);
__decorate([
    class_validator_1.IsDateString(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateSuscriptionDTO.prototype, "startedAt", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsDateString(),
    __metadata("design:type", String)
], UpdateSuscriptionDTO.prototype, "finishedAt", void 0);
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], UpdateSuscriptionDTO.prototype, "cost", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MaxLength(200),
    __metadata("design:type", String)
], UpdateSuscriptionDTO.prototype, "business", void 0);
exports.UpdateSuscriptionDTO = UpdateSuscriptionDTO;
class AddNewSuscriptionSuscriptionDTO extends user_dto_1.SimpleRequest {
    constructor({ userUuid, adminUuid, superAdminUuid, type, invitations, cost, startedAt, finishedAt, typeToUpdate, adminUuidToUpdate, guestUuidToUpdate, }) {
        super({ adminUuid, userUuid, superAdminUuid, type });
        this.invitations = parseInt(invitations);
        this.cost = parseFloat(cost);
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.typeToUpdate = typeToUpdate;
        this.guestUuidToUpdate = guestUuidToUpdate;
        this.adminUuidToUpdate = adminUuidToUpdate;
    }
}
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], AddNewSuscriptionSuscriptionDTO.prototype, "invitations", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    class_validator_1.IsPositive(),
    __metadata("design:type", Number)
], AddNewSuscriptionSuscriptionDTO.prototype, "cost", void 0);
__decorate([
    class_validator_1.IsDateString(),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], AddNewSuscriptionSuscriptionDTO.prototype, "startedAt", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsDateString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], AddNewSuscriptionSuscriptionDTO.prototype, "finishedAt", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], AddNewSuscriptionSuscriptionDTO.prototype, "typeToUpdate", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], AddNewSuscriptionSuscriptionDTO.prototype, "adminUuidToUpdate", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], AddNewSuscriptionSuscriptionDTO.prototype, "guestUuidToUpdate", void 0);
exports.AddNewSuscriptionSuscriptionDTO = AddNewSuscriptionSuscriptionDTO;
class DeleteSuscriptionSuscriptionDTO extends user_dto_1.SimpleRequest {
    constructor({ userUuid, adminUuid, superAdminUuid, type, typeToUpdate, adminUuidToUpdate, guestUuidToUpdate, }) {
        super({ adminUuid, userUuid, superAdminUuid, type });
        this.typeToUpdate = typeToUpdate;
        this.guestUuidToUpdate = guestUuidToUpdate;
        this.adminUuidToUpdate = adminUuidToUpdate;
    }
}
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], DeleteSuscriptionSuscriptionDTO.prototype, "typeToUpdate", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], DeleteSuscriptionSuscriptionDTO.prototype, "adminUuidToUpdate", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], DeleteSuscriptionSuscriptionDTO.prototype, "guestUuidToUpdate", void 0);
exports.DeleteSuscriptionSuscriptionDTO = DeleteSuscriptionSuscriptionDTO;
//# sourceMappingURL=suscription.dto.js.map