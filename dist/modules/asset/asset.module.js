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
const admin_entity_1 = require("../user/user/admin.entity");
const user_entity_1 = require("../user/user/user.entity");
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
            type_asset_module_1.TypeAssetModule,
        ],
        controllers: [asset_controller_1.AssetController],
        providers: [asset_service_1.AssetService]
    })
], AssetModule);
exports.AssetModule = AssetModule;
//# sourceMappingURL=asset.module.js.map