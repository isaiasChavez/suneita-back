"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SesionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sesion_controller_1 = require("./sesion.controller");
const sesion_service_1 = require("./sesion.service");
const sesion_entity_1 = require("./sesion.entity");
const user_entity_1 = require("../user/user.entity");
const admin_entity_1 = require("../user/admin.entity");
const superadmin_entity_1 = require("../user/superadmin.entity");
const type_entity_1 = require("../type/type.entity");
const token_entity_1 = require("../token/token.entity");
const invitation_entity_1 = require("../invitation/invitation.entity");
const role_entity_1 = require("../role/role.entity");
const suscription_entity_1 = require("../../suscription/suscription.entity");
const asset_entity_1 = require("../../asset/asset.entity");
let SesionModule = class SesionModule {
};
SesionModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([sesion_entity_1.Sesion]),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            typeorm_1.TypeOrmModule.forFeature([admin_entity_1.Admin]),
            typeorm_1.TypeOrmModule.forFeature([superadmin_entity_1.SuperAdmin]),
            typeorm_1.TypeOrmModule.forFeature([type_entity_1.Type]),
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.Token]),
            typeorm_1.TypeOrmModule.forFeature([invitation_entity_1.Invitation]),
            typeorm_1.TypeOrmModule.forFeature([role_entity_1.Role]),
            typeorm_1.TypeOrmModule.forFeature([suscription_entity_1.Suscription]),
            typeorm_1.TypeOrmModule.forFeature([asset_entity_1.Asset]),
        ],
        controllers: [sesion_controller_1.SesionController],
        providers: [sesion_service_1.SesionService],
    })
], SesionModule);
exports.SesionModule = SesionModule;
//# sourceMappingURL=sesion.module.js.map