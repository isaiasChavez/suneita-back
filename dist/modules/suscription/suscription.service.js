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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuscriptionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const admin_entity_1 = require("../user/user/admin.entity");
const suscription_entity_1 = require("./suscription.entity");
let SuscriptionService = class SuscriptionService {
    constructor(adminRepository, suscriptionRepository) {
        this.adminRepository = adminRepository;
        this.suscriptionRepository = suscriptionRepository;
    }
    async update(suscription, updateSuscriptionDTO, user, isAdmin, isGuest) {
        try {
            if (!suscription) {
                suscription = await this.suscriptionRepository.findOne({
                    where: {
                        admin: isAdmin ? user : null,
                        user: isGuest ? user : null
                    }
                });
            }
            if (updateSuscriptionDTO.finishedAt) {
                suscription.finishedAt = new Date(updateSuscriptionDTO.finishedAt);
            }
            if (updateSuscriptionDTO.startedAt) {
                suscription.startedAt = new Date(updateSuscriptionDTO.startedAt);
            }
            if (updateSuscriptionDTO.cost) {
                suscription.cost = updateSuscriptionDTO.cost;
            }
            this.suscriptionRepository.save(suscription);
        }
        catch (err) {
            console.log("SuscriptionService - update: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error updating suscription",
            }, 500);
        }
    }
    async delete(userId) {
        try {
            let admin = await this.adminRepository.findOne(userId);
            if (!admin) {
                return {
                    status: 1
                };
            }
            const suscription = await this.suscriptionRepository.findOne({
                where: {
                    admin
                }
            });
            if (!suscription) {
                return {
                    status: 1
                };
            }
            const susTemp = this.suscriptionRepository.create({});
            suscription.isActive = false;
            suscription.isDeleted = true;
            suscription.finishedAt = susTemp.createdAt;
            this.suscriptionRepository.save(suscription);
        }
        catch (err) {
            console.log("SuscriptionService - delete: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error deleting suscription",
            }, 500);
        }
    }
    async add(newSuscription) {
        try {
        }
        catch (err) {
            console.log("SuscriptionService - delete: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error adding  suscription",
            }, 500);
        }
    }
};
SuscriptionService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(admin_entity_1.Admin)),
    __param(1, typeorm_1.InjectRepository(suscription_entity_1.Suscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SuscriptionService);
exports.SuscriptionService = SuscriptionService;
//# sourceMappingURL=suscription.service.js.map