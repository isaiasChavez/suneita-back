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
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            };
        }
    }
    async findAllUsers(udminUuid) {
        return await this.userService.findAllUsers(udminUuid);
    }
    async findUserDetail(email) {
        return await this.userService.findUserDetail(email);
    }
    async confirmUserPassword(confirmUserPassword) {
        let newConfirmUserPassword = new user_dto_1.ConfirmUserPassword(confirmUserPassword);
        try {
            await class_validator_1.validateOrReject(newConfirmUserPassword);
            return await this.userService.confirmPassword(confirmUserPassword);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            };
        }
    }
    async createSuperAdmin(createSuperAdminDTO) {
        let newcreateSuperAdminDTO = new user_dto_1.CreateSuperAdminDTO(createSuperAdminDTO);
        try {
            await class_validator_1.validateOrReject(newcreateSuperAdminDTO);
            return await this.userService.createSuperAdmin(newcreateSuperAdminDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            };
        }
    }
    async updateAdminUser(updateUserAdminDTO) {
        let newupdateUserDTO = new user_dto_1.UpdateUserAdminDTO(updateUserAdminDTO);
        try {
            await class_validator_1.validateOrReject(newupdateUserDTO);
            return await this.userService.updateAdminUser(newupdateUserDTO);
        }
        catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
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
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
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
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
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
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
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
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            };
        }
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
    common_1.Get("/:udminUuid"),
    __param(0, common_1.Param('udminUuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllUsers", null);
__decorate([
    common_1.Get(":email"),
    __param(0, common_1.Param("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserDetail", null);
__decorate([
    common_1.Post("confirm"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.ConfirmUserPassword]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "confirmUserPassword", null);
__decorate([
    common_1.Post("superadmin"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateSuperAdminDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createSuperAdmin", null);
__decorate([
    common_1.Put('admin'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UpdateUserAdminDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateAdminUser", null);
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
    common_1.Put("suspend"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.DeleteAdminUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "suspendAdminUser", null);
UserController = __decorate([
    common_1.Controller("user"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map