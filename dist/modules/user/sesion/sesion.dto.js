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
exports.SesionTokenDTO = exports.ReuestSesionLogOutDTO = exports.ReuestSesionDTO = void 0;
const class_validator_1 = require("class-validator");
class ReuestSesionDTO {
    constructor({ email, password, type }) {
        this.email = email;
        this.password = password;
        this.type = type;
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
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], ReuestSesionDTO.prototype, "type", void 0);
exports.ReuestSesionDTO = ReuestSesionDTO;
class ReuestSesionLogOutDTO {
}
exports.ReuestSesionLogOutDTO = ReuestSesionLogOutDTO;
class SesionTokenDTO {
}
exports.SesionTokenDTO = SesionTokenDTO;
//# sourceMappingURL=sesion.dto.js.map