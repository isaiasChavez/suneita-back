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
exports.Admin = void 0;
const typeorm_1 = require("typeorm");
const type_entity_1 = require("../type/type.entity");
const role_entity_1 = require("../role/role.entity");
const sesion_entity_1 = require("../sesion/sesion.entity");
const uuid_1 = require("uuid");
const superadmin_entity_1 = require("./superadmin.entity");
const user_entity_1 = require("./user.entity");
const suscription_entity_1 = require("../../suscription/suscription.entity");
const asset_entity_1 = require("../../asset/asset.entity");
const token_entity_1 = require("../token/token.entity");
const status_entity_1 = require("../status/status.entity");
let Admin = class Admin {
    createUuid() {
        this.uuid = uuid_1.v4();
        this.email = this.email.toLocaleLowerCase().trim();
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], Admin.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ length: 50 }),
    __metadata("design:type", String)
], Admin.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ length: 50 }),
    __metadata("design:type", String)
], Admin.prototype, "lastname", void 0);
__decorate([
    typeorm_1.Column({ type: "text", default: "https://d1a370nemizbjq.cloudfront.net/569e30b7-51ee-461a-861a-8a43a72473c1.glb" }),
    __metadata("design:type", String)
], Admin.prototype, "avatar", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
        default: 'https://renderapi.s3.amazonaws.com/LOZsbkJ26.png',
    }),
    __metadata("design:type", String)
], Admin.prototype, "thumbnail", void 0);
__decorate([
    typeorm_1.Column({ length: 250 }),
    __metadata("design:type", String)
], Admin.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ length: 100 }),
    __metadata("design:type", String)
], Admin.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Admin.prototype, "business", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => type_entity_1.Type, (tyype) => tyype.user),
    __metadata("design:type", type_entity_1.Type)
], Admin.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => role_entity_1.Role, (role) => role.user),
    __metadata("design:type", role_entity_1.Role)
], Admin.prototype, "role", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => status_entity_1.Status, (status) => status.admin),
    __metadata("design:type", status_entity_1.Status)
], Admin.prototype, "status", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => superadmin_entity_1.SuperAdmin, superadmin => superadmin.admins),
    __metadata("design:type", superadmin_entity_1.SuperAdmin)
], Admin.prototype, "superadmin", void 0);
__decorate([
    typeorm_1.OneToMany(() => user_entity_1.User, user => user.admin),
    __metadata("design:type", Array)
], Admin.prototype, "users", void 0);
__decorate([
    typeorm_1.OneToMany((type) => token_entity_1.Token, (token) => token.admin),
    __metadata("design:type", Array)
], Admin.prototype, "token", void 0);
__decorate([
    typeorm_1.OneToMany((type) => sesion_entity_1.Sesion, (sesion) => sesion.admin),
    __metadata("design:type", Array)
], Admin.prototype, "sesion", void 0);
__decorate([
    typeorm_1.OneToMany(() => suscription_entity_1.Suscription, suscription => suscription.admin),
    __metadata("design:type", Array)
], Admin.prototype, "suscriptions", void 0);
__decorate([
    typeorm_1.OneToMany(() => asset_entity_1.Asset, asset => asset.admin),
    __metadata("design:type", Array)
], Admin.prototype, "assets", void 0);
__decorate([
    typeorm_1.Column({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Admin.prototype, "uuid", void 0);
__decorate([
    typeorm_1.Column({ nullable: false, default: false }),
    __metadata("design:type", Boolean)
], Admin.prototype, "isDeleted", void 0);
__decorate([
    typeorm_1.Column({ nullable: false, default: true }),
    __metadata("design:type", Boolean)
], Admin.prototype, "isActive", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Admin.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Admin.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Admin.prototype, "createUuid", null);
Admin = __decorate([
    typeorm_1.Entity({ schema: "Users" })
], Admin);
exports.Admin = Admin;
//# sourceMappingURL=admin.entity.js.map