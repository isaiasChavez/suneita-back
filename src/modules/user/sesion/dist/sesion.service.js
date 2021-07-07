"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SesionService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var sesion_entity_1 = require("./sesion.entity");
var bcrypt = require("bcrypt");
var types_1 = require("../../../types");
var type_entity_1 = require("../type/type.entity");
var user_entity_1 = require("../user/user.entity");
var admin_entity_1 = require("../user/admin.entity");
var superadmin_entity_1 = require("../user/superadmin.entity");
var token_entity_1 = require("../token/token.entity");
var invitation_entity_1 = require("../invitation/invitation.entity");
var role_entity_1 = require("../role/role.entity");
var suscription_entity_1 = require("src/modules/suscription/suscription.entity");
var jwt = require('jsonwebtoken');
var SesionService = /** @class */ (function () {
    function SesionService(sesionRepository, typeRepository, userRepository, suscriptionRepository, adminRepository, roleRepository, superAdminRepository, tokenRepository, // @InjectRepository(Configuration) // private configurationRepository: Repository<Configuration>,
    invitationRepository) {
        this.sesionRepository = sesionRepository;
        this.typeRepository = typeRepository;
        this.userRepository = userRepository;
        this.suscriptionRepository = suscriptionRepository;
        this.adminRepository = adminRepository;
        this.roleRepository = roleRepository;
        this.superAdminRepository = superAdminRepository;
        this.tokenRepository = tokenRepository;
        this.invitationRepository = invitationRepository;
        this.types = {
            ADMIN: 'ADMIN',
            SUPERADMIN: 'SUPERADMIN',
            USER: 'USER'
        };
        this.roles = {
            SUPERADMIN: 'SUPERADMIN',
            ADMIN: 'ADMIN',
            USER: 'USER'
        };
        console.log({ jwt: jwt });
        this.jwtService = jwt;
    }
    SesionService.prototype.RequesLogin = function (requestDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var response, user, type, match, sesionExist, sesion, dataChildrens, _a, _b, _c, childrens, loggedUser, payload, token, err_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 24, , 25]);
                        console.log('Entra');
                        response = null;
                        user = void 0;
                        type = void 0;
                        return [4 /*yield*/, this.superAdminRepository.findOne({
                                relations: ['type', 'admins'],
                                where: { email: requestDTO.email, isActive: true }
                            })];
                    case 1:
                        user = _d.sent();
                        if (!!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.adminRepository.findOne({
                                relations: ['type', 'users'],
                                where: { email: requestDTO.email, isActive: true }
                            })];
                    case 2:
                        user = _d.sent();
                        _d.label = 3;
                    case 3:
                        if (!!user) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.userRepository.findOne({
                                relations: ['type'],
                                where: { email: requestDTO.email, isActive: true }
                            })];
                    case 4:
                        user = _d.sent();
                        _d.label = 5;
                    case 5:
                        if (!user) {
                            return [2 /*return*/, {
                                    status: 1,
                                    msg: "email does't exist"
                                }];
                        }
                        else {
                            console.log({ user: user });
                            type = user.type;
                        }
                        return [4 /*yield*/, bcrypt.compare(requestDTO.password, user.password)];
                    case 6:
                        match = _d.sent();
                        if (!match) return [3 /*break*/, 22];
                        sesionExist = void 0;
                        if (!(type.name === this.types.SUPERADMIN)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.sesionRepository.findOne({
                                where: { superadmin: user }
                            })];
                    case 7:
                        sesionExist = _d.sent();
                        _d.label = 8;
                    case 8:
                        if (!(type.name === this.types.ADMIN)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.sesionRepository.findOne({
                                where: { admin: user }
                            })];
                    case 9:
                        sesionExist = _d.sent();
                        _d.label = 10;
                    case 10:
                        if (!(type.name === this.types.USER)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.sesionRepository.findOne({
                                where: { user: user }
                            })];
                    case 11:
                        sesionExist = _d.sent();
                        _d.label = 12;
                    case 12:
                        console.log({ sesionExist: sesionExist });
                        if (!sesionExist) return [3 /*break*/, 14];
                        console.log('Existe una sesion');
                        return [4 /*yield*/, this.sesionRepository.remove(sesionExist)];
                    case 13:
                        _d.sent();
                        _d.label = 14;
                    case 14:
                        sesion = void 0;
                        if (type.name === this.types.ADMIN) {
                            sesion = this.sesionRepository.create({
                                admin: user
                            });
                        }
                        if (type.name === this.types.SUPERADMIN) {
                            sesion = this.sesionRepository.create({
                                superadmin: user
                            });
                        }
                        console.log(type.name);
                        if (type.name === this.types.USER) {
                            console.log('Creando');
                            sesion = this.sesionRepository.create({
                                user: user
                            });
                        }
                        dataChildrens = {
                            admins: [], users: []
                        };
                        if (!(type.name === this.types.SUPERADMIN)) return [3 /*break*/, 17];
                        _a = dataChildrens;
                        return [4 /*yield*/, this.adminRepository.find({
                                select: ['name', 'lastname', 'avatar', 'uuid', 'isActive', 'email'],
                                relations: ['suscriptions'],
                                where: {
                                    superadmin: user
                                }
                            })];
                    case 15:
                        _a.admins = _d.sent();
                        _b = dataChildrens;
                        return [4 /*yield*/, this.userRepository.find({
                                select: ['name', 'lastname', 'avatar', 'uuid', 'isActive'],
                                relations: ['suscriptions'],
                                where: {
                                    superadmin: user
                                }
                            })];
                    case 16:
                        _b.users = _d.sent();
                        _d.label = 17;
                    case 17:
                        if (!(type.name === this.types.ADMIN)) return [3 /*break*/, 19];
                        _c = dataChildrens;
                        return [4 /*yield*/, this.userRepository.find({
                                select: ['name', 'lastname', 'avatar', 'uuid', 'isActive'],
                                where: {
                                    admin: user
                                }
                            })];
                    case 18:
                        _c.users = _d.sent();
                        _d.label = 19;
                    case 19:
                        console.log({ dataChildrens: dataChildrens });
                        childrens = {
                            admins: [], users: []
                        };
                        if (type.name === this.types.SUPERADMIN) {
                            childrens.admins = dataChildrens.admins.map(function (child) {
                                var dataToSend = {
                                    avatar: child.avatar,
                                    email: child.email,
                                    isActive: child.isActive,
                                    lastname: child.lastname,
                                    name: child.name,
                                    suscriptions: null,
                                    lastSuscription: null
                                };
                                dataToSend.suscriptions = child.suscriptions.map(function (suscription) {
                                    return {
                                        cost: suscription.cost,
                                        invitations: suscription.invitations,
                                        createdAt: suscription.createdAt,
                                        finishedAt: suscription.finishedAt,
                                        isActive: suscription.isActive,
                                        isDeleted: suscription.isDeleted,
                                        startedAt: suscription.startedAt
                                    };
                                });
                                dataToSend.lastSuscription = dataToSend.suscriptions[0];
                                return dataToSend;
                            });
                            childrens.users = dataChildrens.users.map(function (child) {
                                var dataToSend = {
                                    avatar: child.avatar,
                                    email: child.email,
                                    isActive: child.isActive,
                                    lastname: child.lastname,
                                    name: child.name,
                                    suscriptions: null,
                                    lastSuscription: null
                                };
                                dataToSend.suscriptions = child.suscriptions.map(function (suscription) {
                                    return {
                                        cost: suscription.cost,
                                        createdAt: suscription.createdAt,
                                        finishedAt: suscription.finishedAt,
                                        isActive: suscription.isActive,
                                        isDeleted: suscription.isDeleted,
                                        startedAt: suscription.startedAt
                                    };
                                });
                                dataToSend.lastSuscription = dataToSend.suscriptions[0] ? dataToSend.suscriptions[0] : null;
                                return dataToSend;
                            });
                        }
                        else {
                            childrens.users = dataChildrens.users;
                        }
                        return [4 /*yield*/, this.sesionRepository.save(sesion)];
                    case 20:
                        loggedUser = _d.sent();
                        console.log({ loggedUser: loggedUser });
                        payload = {
                            usuario: {
                                uuid: user.uuid,
                                type: user.type.id
                            }
                        };
                        return [4 /*yield*/, this.jwtService.sign(payload, process.env.SECRETA, {
                                expiresIn: 36000000
                            })];
                    case 21:
                        token = _d.sent();
                        response = {
                            profile: {
                                id: loggedUser.id,
                                token: token,
                                name: user.name,
                                lastname: user.lastname,
                                email: user.email,
                                childrens: childrens,
                                type: type.id
                            },
                            status: 0
                        };
                        return [2 /*return*/, response];
                    case 22:
                        response = { status: 2, msg: "pass doesn't match" };
                        _d.label = 23;
                    case 23: return [2 /*return*/, response];
                    case 24:
                        err_1 = _d.sent();
                        console.log('SesionService - RequesLogin: ', err_1);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error requesting login'
                        }, 500);
                    case 25: return [2 /*return*/];
                }
            });
        });
    };
    SesionService.prototype.RequesLogout = function (reuestSesionLogOutDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var response, user, actualSesion, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        response = null;
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: { email: reuestSesionLogOutDTO.email }
                            })];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sesionRepository.findOne({
                                where: { user: user }
                            })];
                    case 2:
                        actualSesion = _a.sent();
                        return [4 /*yield*/, this.sesionRepository.remove(actualSesion)];
                    case 3:
                        _a.sent();
                        response = { status: 0 };
                        return [3 /*break*/, 5];
                    case 4:
                        response = { status: 1 };
                        _a.label = 5;
                    case 5: return [2 /*return*/, response];
                    case 6:
                        err_2 = _a.sent();
                        console.log('SesionService - RequesLogout: ', err_2);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error requesting logout'
                        }, 500);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SesionService.prototype.decifreToken = function (email) {
        return __awaiter(this, void 0, Promise, function () {
            var dataInvitation, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log({ email: email });
                        return [4 /*yield*/, this.invitationRepository.findOne({
                                where: { email: email },
                                relations: ['type']
                            })];
                    case 1:
                        dataInvitation = _a.sent();
                        if (!dataInvitation) {
                            return [2 /*return*/, { status: 1 }];
                        }
                        return [2 /*return*/, {
                                data: {
                                    email: dataInvitation.email,
                                    company: dataInvitation.company,
                                    type: dataInvitation.type.id
                                },
                                status: 0
                            }];
                    case 2:
                        err_3 = _a.sent();
                        console.log('SesionService - Decifre: ', err_3);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error decifring '
                        }, 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SesionService.prototype.passwordRecovery = function (requestDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var response, jwtDecoded, tokenExist, passwordHashed, userToUpdate, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 15, , 16]);
                        response = { status: 0 };
                        jwtDecoded = jwt.verify(requestDTO.token, process.env.TOKEN_SECRET);
                        if (!!jwtDecoded.token) return [3 /*break*/, 1];
                        response = { status: 10 };
                        return [3 /*break*/, 14];
                    case 1: return [4 /*yield*/, this.tokenRepository.findOne(jwtDecoded.token, {
                            relations: ['type', 'user', 'admin']
                        })];
                    case 2:
                        tokenExist = _a.sent();
                        if (!tokenExist) return [3 /*break*/, 13];
                        return [4 /*yield*/, bcrypt.hash(requestDTO.password, 12)];
                    case 3:
                        passwordHashed = _a.sent();
                        userToUpdate = null;
                        if (!tokenExist.user) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.userRepository.findOne(tokenExist.user.id, {
                                where: {
                                    isActive: true
                                }
                            })];
                    case 4:
                        userToUpdate = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!tokenExist.admin) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.adminRepository.findOne(tokenExist.admin.id, {
                                where: {
                                    isActive: true
                                }
                            })];
                    case 6:
                        userToUpdate = _a.sent();
                        _a.label = 7;
                    case 7:
                        console.log({ userToUpdate: userToUpdate });
                        if (!userToUpdate) {
                            return [2 /*return*/, {
                                    status: 5,
                                    msg: 'Ah ocurrido un  error'
                                }];
                        }
                        userToUpdate.password = passwordHashed;
                        if (!(tokenExist.type.id === types_1.USER_NORMAL)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.userRepository.save(userToUpdate)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        if (!(tokenExist.type.id === types_1.ADMIN)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.adminRepository.save(userToUpdate)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: 
                    // Se elimina el token de la base de datos
                    return [4 /*yield*/, this.tokenRepository.remove(tokenExist)];
                    case 12:
                        // Se elimina el token de la base de datos
                        _a.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        response = { status: 10 };
                        _a.label = 14;
                    case 14: return [2 /*return*/, response];
                    case 15:
                        err_4 = _a.sent();
                        console.log('UserService - passwordRecovery: ', err_4);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error ressetign password'
                        }, 500);
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    SesionService.prototype.requestPasswordReset = function (requestEmail) {
        return __awaiter(this, void 0, Promise, function () {
            var response, user, admin, pettioner, existToken, newToken, registerToken, token, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        console.log('***', { requestEmail: requestEmail }, '***');
                        response = { status: 0 };
                        return [4 /*yield*/, this.userRepository.findOne({
                                relations: ['type'],
                                where: { email: requestEmail }
                            })];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.adminRepository.findOne({
                                relations: ['type'],
                                where: { email: requestEmail }
                            })];
                    case 2:
                        admin = _a.sent();
                        if (!(user || admin)) return [3 /*break*/, 8];
                        pettioner = user ? user : admin;
                        if (user && admin) {
                            return [2 /*return*/, {
                                    status: 5,
                                    msg: 'No es posible'
                                }];
                        }
                        return [4 /*yield*/, this.tokenRepository.findOne({
                                relations: ['admin', 'user'],
                                where: {
                                    user: user ? user : null,
                                    admin: admin ? admin : null
                                }
                            })];
                    case 3:
                        existToken = _a.sent();
                        if (!existToken) return [3 /*break*/, 5];
                        console.log({ existToken: existToken });
                        return [4 /*yield*/, this.tokenRepository.remove(existToken)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        newToken = this.tokenRepository.create({
                            email: requestEmail,
                            type: pettioner.type,
                            user: user ? user : null,
                            admin: admin ? admin : null,
                            superAdmin: null
                        });
                        return [4 /*yield*/, this.tokenRepository.save(newToken)];
                    case 6:
                        registerToken = _a.sent();
                        return [4 /*yield*/, jwt.sign({ token: registerToken.id }, process.env.TOKEN_SECRET, {
                                expiresIn: 7200
                            })];
                    case 7:
                        token = _a.sent();
                        // Se envia correo
                        // await this.mailerService.sendMail({
                        //     to: requestEmail,
                        //     subject: "Recuperacion de contraseña.",
                        //     template: "./recovery.hbs",
                        //     context: {
                        //         url: jwtToken,
                        //         email: requestEmail,
                        //     },
                        // });
                        return [2 /*return*/, {
                                token: token,
                                status: 0
                            }];
                    case 8:
                        response = { status: 1 };
                        _a.label = 9;
                    case 9: return [2 /*return*/, response];
                    case 10:
                        err_5 = _a.sent();
                        console.log('UserService - requestPasswordReset: ', err_5);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error requesting password reset'
                        }, 500);
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    SesionService.prototype.createAdmin = function (createAdminDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var invitation, existUser, adminRole, adminType, userPassword, admin, newAdmin, userSuscription, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        return [4 /*yield*/, this.invitationRepository.findOne({
                                relations: ['superAdmin', 'admin'],
                                where: {
                                    email: createAdminDTO.email
                                }
                            })];
                    case 1:
                        invitation = _a.sent();
                        if (!invitation) {
                            return [2 /*return*/, {
                                    status: 10,
                                    error: 'No hay una invitación para este usuario'
                                }];
                        }
                        return [4 /*yield*/, this.adminRepository.findOne({
                                where: {
                                    email: createAdminDTO.email,
                                    isDeleted: false
                                }
                            })];
                    case 2:
                        existUser = _a.sent();
                        if (!existUser) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.invitationRepository.remove(invitation)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, {
                                status: 2,
                                error: 'Este email ya existe',
                                existUser: existUser
                            }];
                    case 4: return [4 /*yield*/, this.roleRepository.findOne({
                            where: {
                                name: this.roles.ADMIN
                            }
                        })];
                    case 5:
                        adminRole = _a.sent();
                        return [4 /*yield*/, this.roleRepository.findOne({
                                where: {
                                    name: this.types.ADMIN
                                }
                            })];
                    case 6:
                        adminType = _a.sent();
                        return [4 /*yield*/, bcrypt.hash(createAdminDTO.password, 12)];
                    case 7:
                        userPassword = _a.sent();
                        admin = this.adminRepository.create({
                            superadmin: invitation.superAdmin,
                            role: adminRole,
                            type: adminType,
                            name: createAdminDTO.name,
                            lastname: createAdminDTO.lastname,
                            email: createAdminDTO.email,
                            password: userPassword,
                            business: invitation.company
                        });
                        return [4 /*yield*/, this.adminRepository.save(admin)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.adminRepository.findOne({
                                where: {
                                    email: admin.email
                                }
                            })];
                    case 9:
                        newAdmin = _a.sent();
                        userSuscription = this.suscriptionRepository.create({
                            admin: newAdmin,
                            cost: invitation.cost,
                            invitations: invitation.invitations,
                            startedAt: new Date(invitation.startedAt),
                            finishedAt: new Date(invitation.finishedAt)
                        });
                        return [4 /*yield*/, this.suscriptionRepository.save(userSuscription)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.invitationRepository.remove(invitation)];
                    case 11:
                        _a.sent();
                        return [2 /*return*/, { status: 0 }];
                    case 12:
                        err_6 = _a.sent();
                        console.log('UserService - create: ', err_6);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error creting users'
                        }, 500);
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    SesionService.prototype.create = function (createUserDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var invitation, existUser, userRole, userType, userPassword, user, newUser, userSuscription, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        console.log("Creando nuevo usuario");
                        return [4 /*yield*/, this.invitationRepository.findOne({
                                relations: ['admin', 'superAdmin'],
                                where: {
                                    email: createUserDTO.email
                                }
                            })];
                    case 1:
                        invitation = _a.sent();
                        if (!invitation) {
                            return [2 /*return*/, {
                                    status: 1,
                                    error: 'No existe una invitación'
                                }];
                        }
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: {
                                    email: createUserDTO.email,
                                    isDeleted: false
                                }
                            })];
                    case 2:
                        existUser = _a.sent();
                        if (existUser) {
                            return [2 /*return*/, {
                                    status: 2,
                                    error: 'Este email ya existe'
                                }];
                        }
                        return [4 /*yield*/, this.roleRepository.findOne({
                                where: {
                                    name: this.roles.USER
                                }
                            })];
                    case 3:
                        userRole = _a.sent();
                        return [4 /*yield*/, this.roleRepository.findOne({
                                where: {
                                    name: this.types.USER
                                }
                            })];
                    case 4:
                        userType = _a.sent();
                        return [4 /*yield*/, bcrypt.hash(createUserDTO.password, 12)];
                    case 5:
                        userPassword = _a.sent();
                        user = this.userRepository.create({
                            admin: invitation.admin,
                            superadmin: invitation.superAdmin,
                            role: userRole,
                            type: userType,
                            name: createUserDTO.name,
                            lastname: createUserDTO.lastname,
                            email: createUserDTO.email,
                            password: userPassword
                        });
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 6:
                        _a.sent();
                        if (!invitation.superAdmin) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: {
                                    email: user.email
                                }
                            })];
                    case 7:
                        newUser = _a.sent();
                        userSuscription = this.suscriptionRepository.create({
                            user: newUser,
                            cost: invitation.cost,
                            invitations: 0,
                            startedAt: new Date(invitation.startedAt),
                            finishedAt: new Date(invitation.finishedAt)
                        });
                        return [4 /*yield*/, this.suscriptionRepository.save(userSuscription)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        console.log({ user: user });
                        return [4 /*yield*/, this.invitationRepository.remove(invitation)];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, { status: 0 }];
                    case 11:
                        err_7 = _a.sent();
                        console.log('UserService - create: ', err_7);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error getting users'
                        }, 500);
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    SesionService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(sesion_entity_1.Sesion)),
        __param(1, typeorm_1.InjectRepository(type_entity_1.Type)),
        __param(2, typeorm_1.InjectRepository(user_entity_1.User)),
        __param(3, typeorm_1.InjectRepository(suscription_entity_1.Suscription)),
        __param(4, typeorm_1.InjectRepository(admin_entity_1.Admin)),
        __param(5, typeorm_1.InjectRepository(role_entity_1.Role)),
        __param(6, typeorm_1.InjectRepository(superadmin_entity_1.SuperAdmin)),
        __param(7, typeorm_1.InjectRepository(token_entity_1.Token)),
        __param(8, typeorm_1.InjectRepository(invitation_entity_1.Invitation))
    ], SesionService);
    return SesionService;
}());
exports.SesionService = SesionService;
