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
exports.DeleteUserDTO = exports.GetAdminDetailDTO = exports.GetUserDetailDTO = exports.DeleteAdminUserDTO = exports.UpdateUserDTO = exports.UpdateGuestDTO = exports.UpdateUserAdminDTO = exports.CreateSuperAdminDTO = exports.SetSesionAppId = exports.ConfirmUserPassword = exports.ChangeName = exports.FindUserChildrens = exports.InviteUserDTO = exports.SimpleRequest = exports.InviteAdminDTO = exports.UserDTO = void 0;
const class_validator_1 = require("class-validator");
class UserDTO {
    constructor({ email, uuid, name, avatar, isActive, lastname, status }) {
        this.email = email;
        this.avatar = avatar;
        this.isActive = isActive;
        this.name = name;
        this.uuid = uuid;
        this.lastname = lastname;
        this.status = status.id;
    }
}
exports.UserDTO = UserDTO;
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
class SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type }) {
        this.adminUuid = adminUuid;
        this.superAdminUuid = superAdminUuid;
        this.userUuid = userUuid;
        this.type = type;
    }
}
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SimpleRequest.prototype, "adminUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SimpleRequest.prototype, "userUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SimpleRequest.prototype, "superAdminUuid", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], SimpleRequest.prototype, "type", void 0);
exports.SimpleRequest = SimpleRequest;
class InviteUserDTO extends SimpleRequest {
    constructor({ userUuid, adminUuid, superAdminUuid, type, company, name, invitations, cost, startedAt, finishedAt, email, typeToInvite, }) {
        super({ adminUuid, superAdminUuid, userUuid, type });
        this.company = company;
        this.email = email;
        this.name = name;
        this.invitations = parseInt(invitations);
        this.cost = parseFloat(cost);
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.typeToInvite = typeToInvite;
    }
}
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
], InviteUserDTO.prototype, "typeToInvite", void 0);
exports.InviteUserDTO = InviteUserDTO;
class FindUserChildrens {
    constructor({ adminUuid, superAdminUuid, type }) {
        this.adminUuid = adminUuid;
        this.superAdminUuid = superAdminUuid;
        this.type = type;
    }
}
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], FindUserChildrens.prototype, "adminUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], FindUserChildrens.prototype, "superAdminUuid", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], FindUserChildrens.prototype, "type", void 0);
exports.FindUserChildrens = FindUserChildrens;
class ChangeName extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, name }) {
        super({ adminUuid, superAdminUuid, userUuid, type });
        this.name = name;
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], ChangeName.prototype, "name", void 0);
exports.ChangeName = ChangeName;
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
class SetSesionAppId extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, playerId }) {
        super({ adminUuid, superAdminUuid, userUuid, type });
        this.playerId = playerId;
    }
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], SetSesionAppId.prototype, "playerId", void 0);
exports.SetSesionAppId = SetSesionAppId;
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
class UpdateUserAdminDTO extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, name, lastname, startedAt, finishedAt, cost, business, adminUuidToUpdate, }) {
        super({ adminUuid, superAdminUuid, userUuid, type });
        this.name = name ? name : null;
        this.lastname = lastname ? lastname : null;
        this.startedAt = startedAt ? startedAt : null;
        this.finishedAt = finishedAt ? finishedAt : null;
        this.cost = cost ? cost : null;
        this.business = business ? business : null;
        this.adminUuidToUpdate = adminUuidToUpdate;
    }
}
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
    class_validator_1.IsString(),
    class_validator_1.MaxLength(200),
    __metadata("design:type", String)
], UpdateUserAdminDTO.prototype, "business", void 0);
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
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdateUserAdminDTO.prototype, "adminUuidToUpdate", void 0);
exports.UpdateUserAdminDTO = UpdateUserAdminDTO;
class UpdateGuestDTO extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, name, lastname, startedAt, finishedAt, cost, userUuidToUpdate, }) {
        super({ adminUuid, superAdminUuid, userUuid, type });
        this.name = name;
        this.lastname = lastname;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.cost = parseFloat(cost);
        this.userUuidToUpdate = userUuidToUpdate;
    }
}
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateGuestDTO.prototype, "name", void 0);
__decorate([
    class_validator_1.MaxLength(100),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], UpdateGuestDTO.prototype, "lastname", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsDateString(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateGuestDTO.prototype, "startedAt", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsDateString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], UpdateGuestDTO.prototype, "finishedAt", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    class_validator_1.IsPositive(),
    __metadata("design:type", Number)
], UpdateGuestDTO.prototype, "cost", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], UpdateGuestDTO.prototype, "userUuidToUpdate", void 0);
exports.UpdateGuestDTO = UpdateGuestDTO;
class UpdateUserDTO extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, name, avatar, thumbnail, roomImage, }) {
        super({ adminUuid, superAdminUuid, userUuid, type });
        this.name = name;
        this.avatar = avatar;
        this.thumbnail = thumbnail;
        this.roomImage = roomImage;
    }
}
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateUserDTO.prototype, "name", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(150),
    __metadata("design:type", String)
], UpdateUserDTO.prototype, "avatar", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(150),
    __metadata("design:type", String)
], UpdateUserDTO.prototype, "thumbnail", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateUserDTO.prototype, "roomImage", void 0);
exports.UpdateUserDTO = UpdateUserDTO;
class DeleteAdminUserDTO {
    constructor({ superAdminUuid, adminUuidToStop, status }) {
        this.superAdminUuid = superAdminUuid;
        this.adminUuidToStop = adminUuidToStop;
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
], DeleteAdminUserDTO.prototype, "adminUuidToStop", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], DeleteAdminUserDTO.prototype, "status", void 0);
exports.DeleteAdminUserDTO = DeleteAdminUserDTO;
class GetUserDetailDTO {
    constructor({ adminUuid, superAdminUuid, type, userUuidToGet }) {
        this.adminUuid = adminUuid;
        this.userUuidToGet = userUuidToGet;
        this.type = type;
        this.superAdminUuid = superAdminUuid;
    }
}
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", Number)
], GetUserDetailDTO.prototype, "superAdminUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", Number)
], GetUserDetailDTO.prototype, "adminUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", Number)
], GetUserDetailDTO.prototype, "userUuidToGet", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], GetUserDetailDTO.prototype, "type", void 0);
exports.GetUserDetailDTO = GetUserDetailDTO;
class GetAdminDetailDTO {
    constructor({ adminUuid, superAdminUuid, type, adminUuidToGet }) {
        this.superAdminUuid = superAdminUuid;
        this.adminUuid = adminUuid;
        this.adminUuidToGet = adminUuidToGet;
        this.type = type;
    }
}
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", Number)
], GetAdminDetailDTO.prototype, "superAdminUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", Number)
], GetAdminDetailDTO.prototype, "adminUuid", void 0);
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", Number)
], GetAdminDetailDTO.prototype, "adminUuidToGet", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], GetAdminDetailDTO.prototype, "type", void 0);
exports.GetAdminDetailDTO = GetAdminDetailDTO;
class DeleteUserDTO extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, userUuidToChange, status, }) {
        super({ adminUuid, superAdminUuid, type, userUuid });
        this.userUuidToChange = userUuidToChange;
        this.status = status;
    }
}
__decorate([
    class_validator_1.IsUUID(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", Number)
], DeleteUserDTO.prototype, "userUuidToChange", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], DeleteUserDTO.prototype, "status", void 0);
exports.DeleteUserDTO = DeleteUserDTO;
//# sourceMappingURL=user.dto.js.map