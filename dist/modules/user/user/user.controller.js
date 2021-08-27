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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_dto_1 = require("./user.dto");
const class_validator_1 = require("class-validator");
const suscription_dto_1 = require("../../suscription/suscription.dto");
const sesion_dto_1 = require("../sesion/sesion.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async create(inviteUserDTO) {
        let newinviteUserDTO = new user_dto_1.InviteUserDTO(inviteUserDTO);
        try {
            console.log("inviteUser:", { inviteUserDTO });
            await class_validator_1.validateOrReject(newinviteUserDTO);
            return await this.userService.invite(newinviteUserDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async setSesionOfApp(setSesionAppId) {
        let newsetSesionAppId = new user_dto_1.SetSesionAppId(setSesionAppId);
        try {
            console.log("playerid:", { newsetSesionAppId });
            await class_validator_1.validateOrReject(newsetSesionAppId);
            return await this.userService.setSesionOfApp(newsetSesionAppId);
        }
        catch (errors) {
            console.log('Caught promiseee rejection (validation failed)  please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async findUserDetail(request, response) {
        const requestDetailDTO = new user_dto_1.SimpleRequest(request.body);
        try {
            await class_validator_1.validateOrReject(requestDetailDTO);
            return await this.userService.findUserDetail(requestDetailDTO, response);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async findAllUsers(udminUuid) {
        return await this.userService.findAllUsers(udminUuid);
    }
    async getUserChildrens(dto) {
        let findUserChildrens = new user_dto_1.SimpleRequest(dto);
        try {
            await class_validator_1.validateOrReject(findUserChildrens);
            return await this.userService.findUserChildrens(findUserChildrens);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async getUserDetail(dto) {
        try {
            let getUserDetailDTO = new user_dto_1.GetUserDetailDTO(dto);
            await class_validator_1.validateOrReject(getUserDetailDTO);
            return await this.userService.getUserDetail(getUserDetailDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async getAdminDetail(dto) {
        console.log("--->", { dto });
        try {
            let getAdminDetailDTO = new user_dto_1.GetAdminDetailDTO(dto);
            await class_validator_1.validateOrReject(getAdminDetailDTO);
            return await this.userService.getAdminDetail(getAdminDetailDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async confirmUserPassword(confirmUserPassword) {
        let newConfirmUserPassword = new user_dto_1.ConfirmUserPassword(confirmUserPassword);
        try {
            await class_validator_1.validateOrReject(newConfirmUserPassword);
            return await this.userService.confirmPassword(confirmUserPassword);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async addNewPeriod(addNewSuscription) {
        let newaddNewSuscription = new suscription_dto_1.AddNewSuscriptionSuscriptionDTO(addNewSuscription);
        try {
            await class_validator_1.validateOrReject(newaddNewSuscription);
            return await this.userService.addNewPeriod(newaddNewSuscription);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async updateAdmin(updateUserAdminDTO) {
        let newupdateUserDTO = new user_dto_1.UpdateUserAdminDTO(updateUserAdminDTO);
        try {
            await class_validator_1.validateOrReject(newupdateUserDTO);
            return await this.userService.updateAdmin(newupdateUserDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async updateGuest(updateGuestDTO) {
        let newUpdateGuestDTO = new user_dto_1.UpdateGuestDTO(updateGuestDTO);
        try {
            await class_validator_1.validateOrReject(newUpdateGuestDTO);
            return await this.userService.updateGuest(newUpdateGuestDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async updateName(changeName) {
        let newchangeName = new user_dto_1.ChangeName(changeName);
        try {
            await class_validator_1.validateOrReject(newchangeName);
            return await this.userService.updateName(newchangeName);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async updateUser(updateUserDTO) {
        let newupdateUserDTO = new user_dto_1.UpdateUserDTO(updateUserDTO);
        try {
            await class_validator_1.validateOrReject(newupdateUserDTO);
            return await this.userService.updateUser(newupdateUserDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async deleteUser(deleteUserDTO) {
        let newdeleteUserDTO = new user_dto_1.DeleteUserDTO(deleteUserDTO);
        try {
            await class_validator_1.validateOrReject(newdeleteUserDTO);
            return await this.userService.deleteUser(newdeleteUserDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async deleteAdminUser(deleteAdminUserDTO) {
        let newdeleteAdminUserDTO = new user_dto_1.DeleteAdminUserDTO(deleteAdminUserDTO);
        try {
            await class_validator_1.validateOrReject(newdeleteAdminUserDTO);
            return await this.userService.deleteUserAdmin(newdeleteAdminUserDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async suspendAdminUser(suspendAdminUserDTO) {
        let newsuspendAdminUserDTO = new user_dto_1.DeleteAdminUserDTO(suspendAdminUserDTO);
        try {
            await class_validator_1.validateOrReject(newsuspendAdminUserDTO);
            return await this.userService.suspendUserAdmin(newsuspendAdminUserDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async suspendUser(suspendUserDTO) {
        let newSuspendUserDTO = new user_dto_1.DeleteUserDTO(suspendUserDTO);
        try {
            await class_validator_1.validateOrReject(newSuspendUserDTO);
            return await this.userService.suspendUser(newSuspendUserDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            };
        }
    }
    async Logout(requestSesionLogOutDTO) {
        console.log({ requestSesionLogOutDTO });
        return await this.userService.RequesLogout(requestSesionLogOutDTO);
    }
};
__decorate([
    common_1.Post("invite"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.InviteUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    common_1.Post("playerid"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.SetSesionAppId]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setSesionOfApp", null);
__decorate([
    common_1.Get('detail'),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserDetail", null);
__decorate([
    common_1.Get("/:udminUuid"),
    __param(0, common_1.Param('udminUuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllUsers", null);
__decorate([
    common_1.Post("childrens"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.SimpleRequest]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserChildrens", null);
__decorate([
    common_1.Post("userinfo"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.GetUserDetailDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserDetail", null);
__decorate([
    common_1.Post("admininfo"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.GetAdminDetailDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAdminDetail", null);
__decorate([
    common_1.Post("confirm"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.ConfirmUserPassword]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "confirmUserPassword", null);
__decorate([
    common_1.Put('addperiod'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [suscription_dto_1.AddNewSuscriptionSuscriptionDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addNewPeriod", null);
__decorate([
    common_1.Put('admin'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UpdateUserAdminDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateAdmin", null);
__decorate([
    common_1.Put('guest'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UpdateGuestDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateGuest", null);
__decorate([
    common_1.Post("name"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.ChangeName]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateName", null);
__decorate([
    common_1.Put(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UpdateUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    common_1.Put("deleteuser"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.DeleteUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    common_1.Put("deleteadmin"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.DeleteAdminUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteAdminUser", null);
__decorate([
    common_1.Put("suspendadmin"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.DeleteAdminUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "suspendAdminUser", null);
__decorate([
    common_1.Put("suspenduser"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.DeleteUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "suspendUser", null);
__decorate([
    common_1.Post('logout'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sesion_dto_1.ReuestSesionLogOutDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "Logout", null);
UserController = __decorate([
    common_1.Controller("user"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map