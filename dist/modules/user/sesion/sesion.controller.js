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
exports.SesionController = void 0;
const common_1 = require("@nestjs/common");
const sesion_service_1 = require("./sesion.service");
const sesion_dto_1 = require("./sesion.dto");
const class_validator_1 = require("class-validator");
let SesionController = class SesionController {
    constructor(sesionService) {
        this.sesionService = sesionService;
    }
    async Login(reuestSesionDTO) {
        console.log({ reuestSesionDTO });
        let newreuestSesionDTO = new sesion_dto_1.ReuestSesionDTO(reuestSesionDTO);
        try {
            await class_validator_1.validateOrReject(newreuestSesionDTO);
            return await this.sesionService.RequesLogin(reuestSesionDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            };
        }
    }
    async Logout(requestSesionLogOutDTO) {
        return await this.sesionService.RequesLogout(requestSesionLogOutDTO);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sesion_dto_1.ReuestSesionDTO]),
    __metadata("design:returntype", Promise)
], SesionController.prototype, "Login", null);
__decorate([
    common_1.Post('logout'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sesion_dto_1.ReuestSesionLogOutDTO]),
    __metadata("design:returntype", Promise)
], SesionController.prototype, "Logout", null);
SesionController = __decorate([
    common_1.Controller('sesion'),
    __metadata("design:paramtypes", [sesion_service_1.SesionService])
], SesionController);
exports.SesionController = SesionController;
//# sourceMappingURL=sesion.controller.js.map