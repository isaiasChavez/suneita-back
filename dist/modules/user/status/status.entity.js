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
exports.Status = void 0;
const suscription_entity_1 = require("../../suscription/suscription.entity");
const typeorm_1 = require("typeorm");
const admin_entity_1 = require("../user/admin.entity");
const user_entity_1 = require("../user/user.entity");
let Status = class Status {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Status.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ length: 50 }),
    __metadata("design:type", String)
], Status.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(type => user_entity_1.User, user => user.status),
    __metadata("design:type", Array)
], Status.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToMany(type => admin_entity_1.Admin, admin => admin.status),
    __metadata("design:type", Array)
], Status.prototype, "admin", void 0);
Status = __decorate([
    typeorm_1.Entity({ schema: 'Users' })
], Status);
exports.Status = Status;
//# sourceMappingURL=status.entity.js.map