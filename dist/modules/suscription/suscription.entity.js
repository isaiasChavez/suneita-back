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
exports.Suscription = void 0;
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const admin_entity_1 = require("../user/user/admin.entity");
let Suscription = class Suscription {
    createUuid() {
        this.uuid = uuid_1.v4();
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], Suscription.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => admin_entity_1.Admin, admin => admin.suscriptions),
    __metadata("design:type", admin_entity_1.Admin)
], Suscription.prototype, "admin", void 0);
__decorate([
    typeorm_1.Column({
        type: "timestamp without time zone",
        nullable: false,
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], Suscription.prototype, "startedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: "timestamp without time zone",
        nullable: false,
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], Suscription.prototype, "finishedAt", void 0);
__decorate([
    typeorm_1.Column({ type: "numeric", precision: 4, nullable: false, default: 0 }),
    __metadata("design:type", Number)
], Suscription.prototype, "cost", void 0);
__decorate([
    typeorm_1.Column({ type: "uuid", nullable: false }),
    __metadata("design:type", String)
], Suscription.prototype, "uuid", void 0);
__decorate([
    typeorm_1.Column({ nullable: false, default: false }),
    __metadata("design:type", Boolean)
], Suscription.prototype, "isDeleted", void 0);
__decorate([
    typeorm_1.Column({ nullable: false, default: true }),
    __metadata("design:type", Boolean)
], Suscription.prototype, "isActive", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Suscription.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Suscription.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Suscription.prototype, "createUuid", null);
Suscription = __decorate([
    typeorm_1.Entity({ schema: "Users" })
], Suscription);
exports.Suscription = Suscription;
//# sourceMappingURL=suscription.entity.js.map