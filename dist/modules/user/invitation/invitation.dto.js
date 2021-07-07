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
exports.InvitationUserDTO = exports.InvitationAdminDTO = void 0;
const class_validator_1 = require("class-validator");
const types_1 = require("../../../types");
class InvitationAdminDTO {
    constructor({ company, email, invitations, cost, startedAt, finishedAt }) {
        this.company = company;
        this.invitations = invitations;
        this.email = email;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.cost = cost;
        this.type = types_1.SUPER_ADMIN;
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(250),
    __metadata("design:type", String)
], InvitationAdminDTO.prototype, "company", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], InvitationAdminDTO.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], InvitationAdminDTO.prototype, "invitations", void 0);
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], InvitationAdminDTO.prototype, "cost", void 0);
__decorate([
    class_validator_1.IsDateString(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], InvitationAdminDTO.prototype, "startedAt", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsDateString(),
    __metadata("design:type", String)
], InvitationAdminDTO.prototype, "finishedAt", void 0);
exports.InvitationAdminDTO = InvitationAdminDTO;
class InvitationUserDTO {
    constructor({ name, email, cost, startedAt, finishedAt }) {
        this.name = name;
        this.email = email;
        this.cost = cost;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.type = types_1.ADMIN;
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(250),
    __metadata("design:type", String)
], InvitationUserDTO.prototype, "name", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], InvitationUserDTO.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], InvitationUserDTO.prototype, "invitations", void 0);
__decorate([
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], InvitationUserDTO.prototype, "cost", void 0);
__decorate([
    class_validator_1.IsDateString(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], InvitationUserDTO.prototype, "startedAt", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsDateString(),
    __metadata("design:type", String)
], InvitationUserDTO.prototype, "finishedAt", void 0);
exports.InvitationUserDTO = InvitationUserDTO;
//# sourceMappingURL=invitation.dto.js.map