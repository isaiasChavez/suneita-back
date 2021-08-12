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
exports.CreateUserDTO = exports.CreateAdminDTO = exports.SesionTokenDTO = exports.ReuestSesionLogOutDTO = exports.PasswordRecovery = exports.ResetPassword = exports.ReuestSesionDTO = void 0;
const class_validator_1 = require("class-validator");
const user_dto_1 = require("../user/user.dto");
class ReuestSesionDTO {
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
], ReuestSesionDTO.prototype, "email", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MaxLength(100),
    __metadata("design:type", String)
], ReuestSesionDTO.prototype, "password", void 0);
exports.ReuestSesionDTO = ReuestSesionDTO;
class ResetPassword {
    constructor({ email }) {
        this.email = email;
    }
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], ResetPassword.prototype, "email", void 0);
exports.ResetPassword = ResetPassword;
class PasswordRecovery {
    constructor({ password, token }) {
        this.password = password;
        this.token = token;
    }
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MaxLength(100),
    __metadata("design:type", String)
], PasswordRecovery.prototype, "password", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], PasswordRecovery.prototype, "token", void 0);
exports.PasswordRecovery = PasswordRecovery;
class ReuestSesionLogOutDTO extends user_dto_1.SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, isFromCMS, }) {
        super({ adminUuid,
            superAdminUuid,
            userUuid,
            type });
        this.isFromCMS = isFromCMS;
    }
}
exports.ReuestSesionLogOutDTO = ReuestSesionLogOutDTO;
class SesionTokenDTO {
}
exports.SesionTokenDTO = SesionTokenDTO;
class CreateAdminDTO {
    constructor({ name, lastname, email, password, }) {
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(100),
    __metadata("design:type", String)
], CreateAdminDTO.prototype, "name", void 0);
__decorate([
    class_validator_1.MaxLength(100),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateAdminDTO.prototype, "lastname", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(100),
    __metadata("design:type", String)
], CreateAdminDTO.prototype, "email", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MaxLength(100),
    __metadata("design:type", String)
], CreateAdminDTO.prototype, "password", void 0);
exports.CreateAdminDTO = CreateAdminDTO;
class CreateUserDTO {
    constructor({ name, lastname, email, password }) {
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(100),
    __metadata("design:type", String)
], CreateUserDTO.prototype, "name", void 0);
__decorate([
    class_validator_1.MaxLength(100),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateUserDTO.prototype, "lastname", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(100),
    __metadata("design:type", String)
], CreateUserDTO.prototype, "email", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.MaxLength(100),
    __metadata("design:type", String)
], CreateUserDTO.prototype, "password", void 0);
exports.CreateUserDTO = CreateUserDTO;
//# sourceMappingURL=sesion.dto.js.map