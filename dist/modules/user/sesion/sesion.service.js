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
exports.SesionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sesion_entity_1 = require("./sesion.entity");
const bcrypt = require("bcrypt");
const type_entity_1 = require("../type/type.entity");
const user_entity_1 = require("../user/user.entity");
const admin_entity_1 = require("../user/admin.entity");
const superadmin_entity_1 = require("../user/superadmin.entity");
const jwt = require('jsonwebtoken');
let SesionService = class SesionService {
    constructor(sesionRepository, typeRepository, userRepository, adminRepository, superAdminRepository) {
        this.sesionRepository = sesionRepository;
        this.typeRepository = typeRepository;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.superAdminRepository = superAdminRepository;
        this.types = {
            ADMIN: "ADMIN",
            SUPERADMIN: "SUPERADMIN",
            USER: "USER"
        };
        console.log({ jwt });
        this.jwtService = jwt;
    }
    async RequesLogin(requestDTO) {
        try {
            console.log({ requestDTO });
            let response = null;
            let user;
            const type = await this.typeRepository.findOne(requestDTO.type);
            console.log({ type });
            if (type.name === this.types.ADMIN) {
                console.log("Admin");
                user = await this.adminRepository.findOne({
                    relations: [
                        "type", 'users'
                    ],
                    where: { email: requestDTO.email, isActive: true },
                });
            }
            if (type.name === this.types.SUPERADMIN) {
                console.log("Es super admin");
                user = await this.superAdminRepository.findOne({
                    relations: [
                        "type", 'admins'
                    ],
                    where: { email: requestDTO.email, isActive: true },
                });
            }
            console.log({ user });
            if (!user) {
                return {
                    status: 1,
                    msg: `${type.name.toLowerCase()} does't exist`
                };
            }
            const match = await bcrypt.compare(requestDTO.password, user.password);
            if (match) {
                let sesionExist;
                if (type.name === this.types.ADMIN) {
                    sesionExist = await this.sesionRepository.findOne({
                        where: { admin: user },
                    });
                }
                if (type.name === this.types.SUPERADMIN) {
                    sesionExist = await this.sesionRepository.findOne({
                        where: { superadmin: user },
                    });
                }
                if (sesionExist) {
                    await this.sesionRepository.remove(sesionExist);
                }
                let sesion;
                if (type.name === this.types.ADMIN) {
                    sesion = this.sesionRepository.create({
                        admin: user,
                    });
                }
                if (type.name === this.types.SUPERADMIN) {
                    sesion = this.sesionRepository.create({
                        superadmin: user,
                    });
                }
                let childrens;
                if (type.name === this.types.ADMIN) {
                    childrens = await this.userRepository.find({
                        select: ["name", "lastname", "avatar", "uuid", "isActive"],
                        where: {
                            admin: user,
                            isActive: true
                        },
                    });
                }
                if (type.name === this.types.SUPERADMIN) {
                    childrens = await this.adminRepository.find({
                        select: ["name", "lastname", "avatar", "uuid", "isActive"],
                        where: {
                            superadmin: user
                        },
                    });
                }
                const loggedUser = await this.sesionRepository.save(sesion);
                const payload = {
                    usuario: {
                        uuid: user.uuid,
                        type: user.type.id
                    },
                };
                let token = await this.jwtService.sign(payload, process.env.SECRETA, {
                    expiresIn: 36000000,
                });
                response = {
                    profile: {
                        id: loggedUser.id,
                        token,
                        name: user.name,
                        lastname: user.lastname,
                        email: user.email,
                        childrens,
                    },
                    status: 0
                };
                return response;
            }
            else {
                response = { status: 2, msg: "pass doesn't match" };
            }
            return response;
        }
        catch (err) {
            console.log("SesionService - RequesLogin: ", err);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Error requesting login",
            }, 500);
        }
    }
    async RequesLogout(reuestSesionLogOutDTO) {
    }
};
SesionService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(sesion_entity_1.Sesion)),
    __param(1, typeorm_1.InjectRepository(type_entity_1.Type)),
    __param(2, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(3, typeorm_1.InjectRepository(admin_entity_1.Admin)),
    __param(4, typeorm_1.InjectRepository(superadmin_entity_1.SuperAdmin)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SesionService);
exports.SesionService = SesionService;
//# sourceMappingURL=sesion.service.js.map