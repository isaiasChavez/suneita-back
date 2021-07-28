"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const user_entity_1 = require("./user.entity");
const token_entity_1 = require("../token/token.entity");
const type_entity_1 = require("../type/type.entity");
const role_entity_1 = require("../role/role.entity");
const sesion_entity_1 = require("../sesion/sesion.entity");
const superadmin_entity_1 = require("./superadmin.entity");
const admin_entity_1 = require("./admin.entity");
const suscription_entity_1 = require("../../suscription/suscription.entity");
const invitation_entity_1 = require("../invitation/invitation.entity");
const asset_entity_1 = require("../../asset/asset.entity");
let UserModule = class UserModule {
};
UserModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            typeorm_1.TypeOrmModule.forFeature([superadmin_entity_1.SuperAdmin]),
            typeorm_1.TypeOrmModule.forFeature([admin_entity_1.Admin]),
            typeorm_1.TypeOrmModule.forFeature([suscription_entity_1.Suscription]),
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.Token]),
            typeorm_1.TypeOrmModule.forFeature([type_entity_1.Type]),
            typeorm_1.TypeOrmModule.forFeature([role_entity_1.Role]),
            typeorm_1.TypeOrmModule.forFeature([sesion_entity_1.Sesion]),
            typeorm_1.TypeOrmModule.forFeature([invitation_entity_1.Invitation]),
            typeorm_1.TypeOrmModule.forFeature([asset_entity_1.Asset]),
        ],
        providers: [user_service_1.UserService],
        controllers: [user_controller_1.UserController],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map