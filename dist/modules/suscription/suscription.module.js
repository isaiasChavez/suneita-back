"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuscriptionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_entity_1 = require("../user/user/admin.entity");
const suscription_controller_1 = require("./suscription.controller");
const suscription_entity_1 = require("./suscription.entity");
const suscription_service_1 = require("./suscription.service");
let SuscriptionModule = class SuscriptionModule {
};
SuscriptionModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([admin_entity_1.Admin]),
            typeorm_1.TypeOrmModule.forFeature([suscription_entity_1.Suscription]),
        ],
        controllers: [suscription_controller_1.SuscriptionController],
        providers: [suscription_service_1.SuscriptionService]
    })
], SuscriptionModule);
exports.SuscriptionModule = SuscriptionModule;
//# sourceMappingURL=suscription.module.js.map