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
exports.TypeAsset = void 0;
const typeorm_1 = require("typeorm");
const asset_entity_1 = require("../asset.entity");
let TypeAsset = class TypeAsset {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], TypeAsset.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ length: 50 }),
    __metadata("design:type", String)
], TypeAsset.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany((asset) => asset_entity_1.Asset, (asset) => asset.typeAsset),
    __metadata("design:type", Array)
], TypeAsset.prototype, "asset", void 0);
TypeAsset = __decorate([
    typeorm_1.Entity({ schema: "Assets" })
], TypeAsset);
exports.TypeAsset = TypeAsset;
//# sourceMappingURL=type-asset.entity.js.map