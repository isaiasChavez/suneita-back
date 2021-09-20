"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const suscription_entity_1 = require("../suscription/suscription.entity");
const suscription_service_1 = require("../suscription/suscription.service");
const invitation_entity_1 = require("../user/invitation/invitation.entity");
const role_entity_1 = require("../user/role/role.entity");
const sesion_entity_1 = require("../user/sesion/sesion.entity");
const status_entity_1 = require("../user/status/status.entity");
const token_entity_1 = require("../user/token/token.entity");
const type_entity_1 = require("../user/type/type.entity");
const admin_entity_1 = require("../user/user/admin.entity");
const superadmin_entity_1 = require("../user/user/superadmin.entity");
const user_entity_1 = require("../user/user/user.entity");
const user_service_1 = require("../user/user/user.service");
const asset_controller_1 = require("./asset.controller");
const asset_entity_1 = require("./asset.entity");
const asset_service_1 = require("./asset.service");
const type_asset_entity_1 = require("./type-asset/type-asset.entity");
const type_asset_module_1 = require("./type-asset/type-asset.module");
let AssetModule = class AssetModule {
};
AssetModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([admin_entity_1.Admin]),
            typeorm_1.TypeOrmModule.forFeature([asset_entity_1.Asset]),
            typeorm_1.TypeOrmModule.forFeature([type_asset_entity_1.TypeAsset]),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            typeorm_1.TypeOrmModule.forFeature([superadmin_entity_1.SuperAdmin]),
            typeorm_1.TypeOrmModule.forFeature([suscription_entity_1.Suscription]),
            typeorm_1.TypeOrmModule.forFeature([token_entity_1.Token]),
            typeorm_1.TypeOrmModule.forFeature([type_entity_1.Type]),
            typeorm_1.TypeOrmModule.forFeature([role_entity_1.Role]),
            typeorm_1.TypeOrmModule.forFeature([sesion_entity_1.Sesion]),
            typeorm_1.TypeOrmModule.forFeature([invitation_entity_1.Invitation]),
            typeorm_1.TypeOrmModule.forFeature([status_entity_1.Status]),
            type_asset_module_1.TypeAssetModule,
        ],
        controllers: [asset_controller_1.AssetController],
        providers: [asset_service_1.AssetService, user_service_1.UserService, suscription_service_1.SuscriptionService]
    })
], AssetModule);
exports.AssetModule = AssetModule;
//# sourceMappingURL=asset.module.js.map