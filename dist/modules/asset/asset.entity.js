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
exports.Asset = void 0;
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const admin_entity_1 = require("../user/user/admin.entity");
const user_entity_1 = require("../user/user/user.entity");
const type_asset_entity_1 = require("./type-asset/type-asset.entity");
let Asset = class Asset {
    createUuid() {
        this.uuid = uuid_1.v4();
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], Asset.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ length: 300, nullable: false }),
    __metadata("design:type", String)
], Asset.prototype, "url", void 0);
__decorate([
    typeorm_1.Column({ length: 300, nullable: true, default: '' }),
    __metadata("design:type", String)
], Asset.prototype, "thumbnail", void 0);
__decorate([
    typeorm_1.Column({ type: "uuid", nullable: false }),
    __metadata("design:type", String)
], Asset.prototype, "uuid", void 0);
__decorate([
    typeorm_1.Column({ nullable: false, default: true }),
    __metadata("design:type", Boolean)
], Asset.prototype, "isActive", void 0);
__decorate([
    typeorm_1.Column({ nullable: false, default: false }),
    __metadata("design:type", Boolean)
], Asset.prototype, "isDeleted", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Asset.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Asset.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Asset.prototype, "createUuid", null);
__decorate([
    typeorm_1.ManyToOne(() => admin_entity_1.Admin, admin => admin.assets),
    __metadata("design:type", admin_entity_1.Admin)
], Asset.prototype, "admin", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_entity_1.User, user => user.assets),
    __metadata("design:type", user_entity_1.User)
], Asset.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne((typeAsset) => type_asset_entity_1.TypeAsset, (typeAsset) => typeAsset.asset),
    __metadata("design:type", type_asset_entity_1.TypeAsset)
], Asset.prototype, "typeAsset", void 0);
Asset = __decorate([
    typeorm_1.Entity({ schema: "Assets" })
], Asset);
exports.Asset = Asset;
//# sourceMappingURL=asset.entity.js.map