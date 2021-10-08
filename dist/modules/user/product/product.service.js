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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const jwt = require('jsonwebtoken');
const types_1 = require("../../../types");
let UserService = class UserService {
    constructor() {
        this.roles = {
            SUPERADMIN: 'SUPERADMIN',
            ADMIN: 'ADMIN',
            USER: 'USER',
        };
        this.types = {
            SUPERADMIN: 'SUPERADMIN',
            ADMIN: 'ADMIN',
            USER: 'USER',
        };
        this.typesNumbers = {
            SUPERADMIN: 1,
            ADMIN: 2,
            USER: 3,
        };
        this.statusNumbers = {
            ACTIVE: 1,
            INACTIVE: 2,
            EXPIRED: 3,
        };
    }
    async createProduct(uuid) {
        try {
        }
        catch (err) {
            console.log('UserService - createUser: ', err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error creating product',
            }, 500);
        }
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=product.service.js.map