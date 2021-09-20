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
        const newreuestSesionDTO = new sesion_dto_1.ReuestSesionDTO(reuestSesionDTO);
        try {
            await class_validator_1.validateOrReject(newreuestSesionDTO);
            console.log('Validado');
            return await this.sesionService.RequesLogin(reuestSesionDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors,
            };
        }
    }
    async LoginFromApp(reuestSesionDTO) {
        const newreuestSesionDTO = new sesion_dto_1.ReuestSesionDTO(reuestSesionDTO);
        try {
            await class_validator_1.validateOrReject(newreuestSesionDTO);
            return await this.sesionService.RequesLoginFromApp(reuestSesionDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors,
            };
        }
    }
    async validating(token) {
        if (token.length < 50) {
            return {
                status: 5,
            };
        }
        return await this.sesionService.validateIfExistToken(token);
    }
    async recoveryPassword(passwordRecovery) {
        const newPasswordRecovery = new sesion_dto_1.PasswordRecovery(passwordRecovery);
        try {
            await class_validator_1.validateOrReject(newPasswordRecovery);
            return await this.sesionService.passwordRecovery(newPasswordRecovery);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors,
            };
        }
    }
    async requestPasswordReset(email) {
        console.log('requestPasswordReset');
        return await this.sesionService.requestPasswordReset(email);
    }
    async sendInformationForm(sendEmailInfo) {
        const newsendEmailInfo = new sesion_dto_1.SendEmailInfo(sendEmailInfo);
        try {
            await class_validator_1.validateOrReject(newsendEmailInfo);
            return await this.sesionService.sendInformationForm(newsendEmailInfo);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors,
            };
        }
    }
    async Logout(requestSesionLogOutDTO) {
        console.log({ requestSesionLogOutDTO });
        return await this.sesionService.RequesLogout(requestSesionLogOutDTO);
    }
    async Decifring(email) {
        return await this.sesionService.decifreToken(email);
    }
    async createAdmin(createAdminDTO) {
        let newcreateAdminDTO = new sesion_dto_1.CreateAdminDTO(createAdminDTO);
        try {
            await class_validator_1.validateOrReject(newcreateAdminDTO);
            return await this.sesionService.createAdmin(newcreateAdminDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors,
            };
        }
    }
    async createUser(createUserDTO) {
        let newCreateUserDTO = new sesion_dto_1.CreateUserDTO(createUserDTO);
        try {
            await class_validator_1.validateOrReject(newCreateUserDTO);
            return await this.sesionService.createGuest(newCreateUserDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors,
            };
        }
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
    common_1.Post('login'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sesion_dto_1.ReuestSesionDTO]),
    __metadata("design:returntype", Promise)
], SesionController.prototype, "LoginFromApp", null);
__decorate([
    common_1.Post('validate/:token'),
    __param(0, common_1.Param('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SesionController.prototype, "validating", null);
__decorate([
    common_1.Put('recovery'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sesion_dto_1.PasswordRecovery]),
    __metadata("design:returntype", Promise)
], SesionController.prototype, "recoveryPassword", null);
__decorate([
    common_1.Post('requestreset/:email'),
    __param(0, common_1.Param('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SesionController.prototype, "requestPasswordReset", null);
__decorate([
    common_1.Post('info'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sesion_dto_1.SendEmailInfo]),
    __metadata("design:returntype", Promise)
], SesionController.prototype, "sendInformationForm", null);
__decorate([
    common_1.Post('logout'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sesion_dto_1.ReuestSesionLogOutDTO]),
    __metadata("design:returntype", Promise)
], SesionController.prototype, "Logout", null);
__decorate([
    common_1.Get('des/:email'),
    __param(0, common_1.Param('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SesionController.prototype, "Decifring", null);
__decorate([
    common_1.Post('admin'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sesion_dto_1.CreateAdminDTO]),
    __metadata("design:returntype", Promise)
], SesionController.prototype, "createAdmin", null);
__decorate([
    common_1.Post('user'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sesion_dto_1.CreateUserDTO]),
    __metadata("design:returntype", Promise)
], SesionController.prototype, "createUser", null);
SesionController = __decorate([
    common_1.Controller('sesion'),
    __metadata("design:paramtypes", [sesion_service_1.SesionService])
], SesionController);
exports.SesionController = SesionController;
//# sourceMappingURL=sesion.controller.js.map