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
exports.Invitation = void 0;
const typeorm_1 = require("typeorm");
const type_entity_1 = require("../type/type.entity");
const admin_entity_1 = require("../user/admin.entity");
const superadmin_entity_1 = require("../user/superadmin.entity");
let Invitation = class Invitation {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Invitation.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ length: 250, nullable: true }),
    __metadata("design:type", String)
], Invitation.prototype, "company", void 0);
__decorate([
    typeorm_1.Column({ length: 250, nullable: true }),
    __metadata("design:type", String)
], Invitation.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ length: 250 }),
    __metadata("design:type", String)
], Invitation.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Invitation.prototype, "invitations", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Invitation.prototype, "cost", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp without time zone',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Invitation.prototype, "startedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp without time zone',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Invitation.prototype, "finishedAt", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => type_entity_1.Type, (tyype) => tyype.token),
    __metadata("design:type", type_entity_1.Type)
], Invitation.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToOne((admin) => admin_entity_1.Admin, (admin) => admin.token),
    __metadata("design:type", admin_entity_1.Admin)
], Invitation.prototype, "admin", void 0);
__decorate([
    typeorm_1.ManyToOne((superAdmin) => superadmin_entity_1.SuperAdmin, (superAdmin) => superAdmin.token),
    __metadata("design:type", superadmin_entity_1.SuperAdmin)
], Invitation.prototype, "superAdmin", void 0);
Invitation = __decorate([
    typeorm_1.Entity({ schema: 'Users' })
], Invitation);
exports.Invitation = Invitation;
//# sourceMappingURL=invitation.entity.js.map