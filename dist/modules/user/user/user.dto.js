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
exports.DeleteUserDTO = exports.DeleteAdminUserDTO = exports.UpdateUserDTO = exports.UpdateUserAdminDTO = exports.CreateSuperAdminDTO = exports.ConfirmUserPassword = exports.InviteUserDTO = exports.InviteAdminDTO = void 0;
const class_validator_1 = require("class-validator");
class InviteAdminDTO {
    constructor({ email, type }) {
        this.email = email;
        this.type = type;
    }
}
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], InviteAdminDTO.prototype, "superAdminUuid", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], InviteAdminDTO.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], InviteAdminDTO.prototype, "type", void 0);
exports.InviteAdminDTO = InviteAdminDTO;
class InviteUserDTO {
    constructor({ adminUuid, superAdminUuid, company, name, invitations, cost, startedAt, finishedAt, email, type, typeToInvite, }) {
        this.adminUuid = adminUuid;
        this.company = company;
        this.superAdminUuid = superAdminUuid;
        this.email = email;
        this.type = type;
        this.name = name;
        this.invitations = parseInt(invitations);
        this.cost = parseFloat(cost);
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.typeToInvite = typeToInvite;
    }
}
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], InviteUserDTO.prototype, "adminUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], InviteUserDTO.prototype, "superAdminUuid", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], InviteUserDTO.prototype, "email", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(250),
    __metadata("design:type", String)
], InviteUserDTO.prototype, "company", void 0);
__decorate([
    class_validator_1.MaxLength(250),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], InviteUserDTO.prototype, "name", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], InviteUserDTO.prototype, "invitations", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    class_validator_1.IsPositive(),
    __metadata("design:type", Number)
], InviteUserDTO.prototype, "cost", void 0);
__decorate([
    class_validator_1.IsDateString(),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], InviteUserDTO.prototype, "startedAt", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsDateString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], InviteUserDTO.prototype, "finishedAt", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], InviteUserDTO.prototype, "type", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], InviteUserDTO.prototype, "typeToInvite", void 0);
exports.InviteUserDTO = InviteUserDTO;
class ConfirmUserPassword {
    constructor({ email, password }) {
        this.email = email;
        this.password = password;
    }
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], ConfirmUserPassword.prototype, "email", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MaxLength(100),
    __metadata("design:type", String)
], ConfirmUserPassword.prototype, "password", void 0);
exports.ConfirmUserPassword = ConfirmUserPassword;
class CreateSuperAdminDTO {
    constructor({ name, lastname, email, password, passwordmaster }) {
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.passwordmaster = passwordmaster;
        this.password = password;
    }
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MaxLength(12),
    __metadata("design:type", String)
], CreateSuperAdminDTO.prototype, "passwordmaster", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(100),
    __metadata("design:type", String)
], CreateSuperAdminDTO.prototype, "name", void 0);
__decorate([
    class_validator_1.MaxLength(100),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateSuperAdminDTO.prototype, "lastname", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    class_validator_1.MaxLength(100),
    __metadata("design:type", String)
], CreateSuperAdminDTO.prototype, "email", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MaxLength(100),
    __metadata("design:type", String)
], CreateSuperAdminDTO.prototype, "password", void 0);
exports.CreateSuperAdminDTO = CreateSuperAdminDTO;
class UpdateUserAdminDTO {
    constructor({ superAdminUuid, adminUuid, name, lastname, avatar, startedAt, finishedAt, cost, business, }) {
        this.superAdminUuid = superAdminUuid;
        this.adminUuid = adminUuid;
        this.name = name;
        this.lastname = lastname;
        this.avatar = avatar;
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
], UpdateUserAdminDTO.prototype, "superAdminUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateUserAdminDTO.prototype, "adminUuid", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(100),
    __metadata("design:type", String)
], UpdateUserAdminDTO.prototype, "name", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.MaxLength(100),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateUserAdminDTO.prototype, "lastname", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.MaxLength(200),
    __metadata("design:type", String)
], UpdateUserAdminDTO.prototype, "avatar", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsDateString(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateUserAdminDTO.prototype, "startedAt", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.IsDateString(),
    __metadata("design:type", String)
], UpdateUserAdminDTO.prototype, "finishedAt", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], UpdateUserAdminDTO.prototype, "cost", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(200),
    __metadata("design:type", String)
], UpdateUserAdminDTO.prototype, "business", void 0);
exports.UpdateUserAdminDTO = UpdateUserAdminDTO;
class UpdateUserDTO {
    constructor({ userUuid, adminUuid, name, lastname, avatar }) {
        this.userUuid = userUuid;
        this.adminUuid = adminUuid;
        this.name = name;
        this.lastname = lastname;
        this.avatar = avatar;
    }
}
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateUserDTO.prototype, "userUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateUserDTO.prototype, "adminUuid", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MaxLength(100),
    __metadata("design:type", String)
], UpdateUserDTO.prototype, "name", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MaxLength(150),
    __metadata("design:type", String)
], UpdateUserDTO.prototype, "avatar", void 0);
__decorate([
    class_validator_1.MaxLength(100),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], UpdateUserDTO.prototype, "lastname", void 0);
exports.UpdateUserDTO = UpdateUserDTO;
class DeleteAdminUserDTO {
    constructor({ superAdminUuid, adminUuid, status }) {
        this.superAdminUuid = superAdminUuid;
        this.adminUuid = adminUuid;
        this.status = status;
    }
}
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", Number)
], DeleteAdminUserDTO.prototype, "superAdminUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", Number)
], DeleteAdminUserDTO.prototype, "adminUuid", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], DeleteAdminUserDTO.prototype, "status", void 0);
exports.DeleteAdminUserDTO = DeleteAdminUserDTO;
class DeleteUserDTO {
    constructor({ adminUuid, userUuid }) {
        this.userUuid = userUuid;
        this.adminUuid = adminUuid;
    }
}
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", Number)
], DeleteUserDTO.prototype, "adminUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", Number)
], DeleteUserDTO.prototype, "userUuid", void 0);
exports.DeleteUserDTO = DeleteUserDTO;
//# sourceMappingURL=user.dto.js.map