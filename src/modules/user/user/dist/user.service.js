"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.UserService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var typeorm_2 = require("typeorm");
var user_entity_1 = require("./user.entity");
var token_entity_1 = require("../token/token.entity");
var type_entity_1 = require("../type/type.entity");
var role_entity_1 = require("../role/role.entity");
// import { Target } from "../../trivia/target/target.entity";
var sesion_entity_1 = require("../sesion/sesion.entity");
var user_dto_1 = require("./user.dto");
var jwt = require('jsonwebtoken');
var bcrypt = require("bcrypt");
var types_1 = require("src/types");
var superadmin_entity_1 = require("./superadmin.entity");
var admin_entity_1 = require("./admin.entity");
var suscription_entity_1 = require("src/modules/suscription/suscription.entity");
var asset_entity_1 = require("src/modules/asset/asset.entity");
var invitation_entity_1 = require("../invitation/invitation.entity");
var UserService = /** @class */ (function () {
    function UserService(mailerService, 
    // private readonly suscriptionService: SuscriptionService,
    userRepository, suscripctionRepository, superAdminRepository, adminRepository, tokenRepository, assetRepository, typeRepository, roleRepository, invitationRepository, sesionRepository, suscriptionRepository) {
        this.mailerService = mailerService;
        this.userRepository = userRepository;
        this.suscripctionRepository = suscripctionRepository;
        this.superAdminRepository = superAdminRepository;
        this.adminRepository = adminRepository;
        this.tokenRepository = tokenRepository;
        this.assetRepository = assetRepository;
        this.typeRepository = typeRepository;
        this.roleRepository = roleRepository;
        this.invitationRepository = invitationRepository;
        this.sesionRepository = sesionRepository;
        this.suscriptionRepository = suscriptionRepository;
        this.roles = {
            SUPERADMIN: 'SUPERADMIN',
            ADMIN: 'ADMIN',
            USER: 'USER'
        };
        this.types = {
            SUPERADMIN: 'SUPERADMIN',
            ADMIN: 'ADMIN',
            USER: 'USER'
        };
        this.typesNumbers = {
            SUPERADMIN: 1,
            ADMIN: 2,
            USER: 3
        };
    }
    UserService.prototype.invite = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var status, invitationToSign, jwtToken, userExistInDB, adminExistInDB, invitation, typeUserRequesting, admin, superAdmin, typeToInvite, invitationBase, newInvitation, registerToken, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 19, , 20]);
                        status = 0;
                        invitationToSign = '';
                        jwtToken = null;
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: {
                                    email: request.email,
                                    isDeleted: false
                                }
                            })];
                    case 1:
                        userExistInDB = _a.sent();
                        adminExistInDB = void 0;
                        if (!!userExistInDB) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.adminRepository.findOne({
                                where: { email: request.email, isDeleted: false }
                            })];
                    case 2:
                        adminExistInDB = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!(!userExistInDB && !adminExistInDB)) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.invitationRepository.findOne({
                                where: { email: request.email }
                            })];
                    case 4:
                        invitation = _a.sent();
                        console.log({ invitation: invitation });
                        if (!!invitation) return [3 /*break*/, 14];
                        typeUserRequesting = void 0;
                        admin = null;
                        superAdmin = null;
                        if (!request.adminUuid) return [3 /*break*/, 6];
                        typeUserRequesting = types_1.ADMIN;
                        return [4 /*yield*/, this.adminRepository.findOne({
                                where: {
                                    uuid: request.adminUuid
                                }
                            })];
                    case 5:
                        admin = _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!request.superAdminUuid) return [3 /*break*/, 8];
                        typeUserRequesting = types_1.SUPER_ADMIN;
                        return [4 /*yield*/, this.superAdminRepository.findOne({
                                where: {
                                    uuid: request.superAdminUuid
                                }
                            })];
                    case 7:
                        superAdmin = _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!admin && !superAdmin) {
                            return [2 /*return*/, {
                                    status: 5
                                }];
                        }
                        typeToInvite = void 0;
                        if (!(request.typeToInvite === types_1.ADMIN)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.typeRepository.findOne(types_1.ADMIN)];
                    case 9:
                        typeToInvite = _a.sent();
                        _a.label = 10;
                    case 10:
                        if (!(request.typeToInvite === types_1.USER_NORMAL)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.typeRepository.findOne(types_1.USER_NORMAL)];
                    case 11:
                        typeToInvite = _a.sent();
                        _a.label = 12;
                    case 12:
                        invitationBase = {
                            email: request.email,
                            cost: 0,
                            finishedAt: new Date(request.finishedAt),
                            startedAt: new Date(request.startedAt),
                            admin: admin,
                            superAdmin: superAdmin,
                            type: typeToInvite,
                            company: null,
                            invitations: null,
                            name: null
                        };
                        //Hay que tener en cuenta que el usuario y el super usuario pueden enviar invitaciones.
                        //Y hay que diferenciar las del super, hay que hacer dos diferenciaciones.
                        if (typeToInvite.id === types_1.ADMIN) {
                            invitationBase.company = request.company;
                            invitationBase.invitations = request.invitations;
                            invitationBase.cost = request.cost;
                        }
                        if (typeToInvite.id === types_1.USER_NORMAL) {
                            invitationBase.name = request.name;
                            invitationBase.cost = request.cost;
                        }
                        newInvitation = this.invitationRepository.create(__assign({}, invitationBase));
                        console.log({ newInvitation: newInvitation });
                        return [4 /*yield*/, this.invitationRepository.save(newInvitation)];
                    case 13:
                        registerToken = _a.sent();
                        invitationToSign = registerToken.id;
                        return [3 /*break*/, 15];
                    case 14:
                        invitationToSign = invitation.id;
                        _a.label = 15;
                    case 15: return [4 /*yield*/, jwt.sign({ token: invitationToSign }, process.env.TOKEN_SECRET)];
                    case 16:
                        // Se genera jwt para enviar por correo
                        jwtToken = _a.sent();
                        // Se envia correo
                        console.log({ jwtToken: jwtToken });
                        return [3 /*break*/, 18];
                    case 17:
                        if ((userExistInDB && userExistInDB.isActive) || (adminExistInDB && adminExistInDB.isActive)) {
                            status = 9;
                        }
                        else {
                            status = 8;
                        }
                        _a.label = 18;
                    case 18: return [2 /*return*/, { status: status, token: jwtToken }];
                    case 19:
                        err_1 = _a.sent();
                        console.log('UserService - invite: ', err_1);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error invitins user'
                        }, 500);
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.findAllUsers = function (uuid) {
        return __awaiter(this, void 0, Promise, function () {
            var admin, users, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.adminRepository.findOne({
                                where: {
                                    uuid: uuid
                                }
                            })];
                    case 1:
                        admin = _a.sent();
                        return [4 /*yield*/, this.userRepository.find({
                                select: ['id', 'name', 'email'],
                                relations: ['type'],
                                where: {
                                    isActive: true,
                                    admin: admin
                                }
                            })];
                    case 2:
                        users = _a.sent();
                        return [2 /*return*/, { users: users }];
                    case 3:
                        err_2 = _a.sent();
                        console.log('UserService - findAll: ', err_2);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error getting users list'
                        }, 500);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.confirmPassword = function (requestDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var response, userExist, match, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        response = { status: 0 };
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: { email: requestDTO.email },
                                select: ['id', 'name', 'email', 'password']
                            })];
                    case 1:
                        userExist = _a.sent();
                        if (!userExist) return [3 /*break*/, 3];
                        return [4 /*yield*/, bcrypt.compare(requestDTO.password, userExist.password)];
                    case 2:
                        match = _a.sent();
                        if (!match) {
                            response = { status: 2 };
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        response = { status: 1 };
                        _a.label = 4;
                    case 4: return [2 /*return*/, response];
                    case 5:
                        err_3 = _a.sent();
                        console.log('UserService - confirmPassword: ', err_3);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error confirming user password'
                        }, 500);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    //Información del usuario logueado 
    UserService.prototype.findUserDetail = function (requestDetailDTO, res) {
        return __awaiter(this, void 0, Promise, function () {
            var user, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getWhoIsRequesting(requestDetailDTO)];
                    case 1:
                        user = (_a.sent()).user;
                        if (!user) {
                            return [2 /*return*/, res.status(404)];
                        }
                        return [2 /*return*/, res.status(201).json({
                                status: 0,
                                profile: {
                                    id: user.id,
                                    name: user.name,
                                    uuid: user.uuid,
                                    lastname: user.lastname,
                                    thumbnail: user.thumbnail,
                                    email: user.email,
                                    type: user.type.id
                                }
                            })];
                    case 2:
                        err_4 = _a.sent();
                        console.log('UserService - findUserDetail: ', err_4);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error getting user'
                        }, 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getAdminDetail = function (getAdminDetailDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var admin, suscriptions, lastSuscription, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.adminRepository.findOne({
                                relations: ['type', 'suscriptions'],
                                where: {
                                    uuid: getAdminDetailDTO.adminUuidToGet
                                }
                            })];
                    case 1:
                        admin = _a.sent();
                        suscriptions = admin.suscriptions.map(function (suscription) {
                            return {
                                cost: suscription.cost,
                                createdAt: suscription.createdAt,
                                finishedAt: suscription.finishedAt,
                                isActive: suscription.isActive,
                                isDeleted: suscription.isDeleted,
                                startedAt: suscription.startedAt
                            };
                        });
                        lastSuscription = suscriptions.length > 0
                            ? suscriptions[0]
                            : null;
                        return [2 /*return*/, {
                                admin: {
                                    id: admin.id,
                                    name: admin.name,
                                    lastname: admin.lastname,
                                    uuid: admin.uuid,
                                    email: admin.email,
                                    type: admin.type.id,
                                    lastSuscription: lastSuscription
                                }
                            }];
                    case 2:
                        err_5 = _a.sent();
                        console.log('UserService - getAdminDetail: ', err_5);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error getting user'
                        }, 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getUserDetail = function (getUserDetailDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var user, suscriptions, lastSuscription, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.adminRepository.findOne({
                                relations: ['type', 'suscriptions'],
                                where: {
                                    uuid: getUserDetailDTO.userUuidToGet
                                }
                            })];
                    case 1:
                        user = _a.sent();
                        suscriptions = user.suscriptions.map(function (suscription) {
                            return {
                                cost: suscription.cost,
                                createdAt: suscription.createdAt,
                                finishedAt: suscription.finishedAt,
                                isActive: suscription.isActive,
                                isDeleted: suscription.isDeleted,
                                startedAt: suscription.startedAt
                            };
                        });
                        lastSuscription = suscriptions.length > 0
                            ? suscriptions[0]
                            : null;
                        return [2 /*return*/, {
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    lastname: user.lastname,
                                    uuid: user.uuid,
                                    email: user.email,
                                    type: user.type.id,
                                    lastSuscription: lastSuscription
                                }
                            }];
                    case 2:
                        err_6 = _a.sent();
                        console.log('UserService - getAdminDetail: ', err_6);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error getting user'
                        }, 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.findUserChildrens = function (findUserChildrensDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var user, dataChildrens, isSuperAdmin, isAdmin, _a, _b, _c, childrens, filterUsers, err_7;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 10, , 11]);
                        user = void 0;
                        dataChildrens = {
                            admins: [],
                            users: []
                        };
                        isSuperAdmin = findUserChildrensDTO.type === this.typesNumbers.SUPERADMIN;
                        isAdmin = findUserChildrensDTO.type === this.typesNumbers.ADMIN;
                        if (!isAdmin) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.adminRepository.findOne({
                                relations: ['type'],
                                where: {
                                    uuid: findUserChildrensDTO.adminUuid,
                                    isActive: true,
                                    isDeleted: false
                                }
                            })];
                    case 1:
                        user = _d.sent();
                        _d.label = 2;
                    case 2:
                        if (!isSuperAdmin) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.superAdminRepository.findOne({
                                relations: ['type'],
                                where: {
                                    uuid: findUserChildrensDTO.superAdminUuid,
                                    isActive: true
                                }
                            })];
                    case 3:
                        user = _d.sent();
                        _d.label = 4;
                    case 4:
                        if (!user) {
                            return [2 /*return*/, {
                                    status: 1,
                                    msg: 'User not found'
                                }];
                        }
                        if (!isSuperAdmin) return [3 /*break*/, 7];
                        _a = dataChildrens;
                        return [4 /*yield*/, this.adminRepository.find({
                                select: ['name', 'lastname', 'avatar', 'uuid', 'isActive', 'email'],
                                relations: ['suscriptions'],
                                where: {
                                    superadmin: user,
                                    isDeleted: false
                                }
                            })];
                    case 5:
                        _a.admins = _d.sent();
                        _b = dataChildrens;
                        return [4 /*yield*/, this.userRepository.find({
                                select: ['name', 'lastname', 'avatar', 'uuid', 'isActive'],
                                relations: ['suscriptions'],
                                where: {
                                    superadmin: user,
                                    isDeleted: false
                                }
                            })];
                    case 6:
                        _b.users = _d.sent();
                        _d.label = 7;
                    case 7:
                        if (!isAdmin) return [3 /*break*/, 9];
                        _c = dataChildrens;
                        return [4 /*yield*/, this.userRepository.find({
                                select: ['name', 'lastname', 'email', 'avatar', 'uuid', 'isActive'],
                                relations: ['suscriptions'],
                                where: {
                                    admin: user,
                                    isDeleted: false
                                }
                            })];
                    case 8:
                        _c.users = _d.sent();
                        _d.label = 9;
                    case 9:
                        childrens = {
                            admins: [],
                            users: []
                        };
                        filterUsers = function (child) {
                            var dataToSend = {
                                avatar: child.avatar,
                                email: child.email,
                                isActive: child.isActive,
                                uuid: child.uuid,
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
                            dataToSend.lastSuscription = dataToSend.suscriptions[0]
                                ? dataToSend.suscriptions[0]
                                : null;
                            return dataToSend;
                        };
                        if (isSuperAdmin) {
                            childrens.admins = dataChildrens.admins.map(function (child) {
                                var dataToSend = {
                                    avatar: child.avatar,
                                    email: child.email,
                                    isActive: child.isActive,
                                    lastname: child.lastname,
                                    uuid: child.uuid,
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
                            childrens.users = dataChildrens.users.map(filterUsers);
                        }
                        else {
                            childrens.users = dataChildrens.users.map(filterUsers);
                        }
                        return [2 /*return*/, {
                                profile: {
                                    id: user.id,
                                    name: user.name,
                                    uuid: user.uuid,
                                    lastname: user.lastname,
                                    email: user.email,
                                    type: user.type.id,
                                    childrens: childrens
                                }
                            }];
                    case 10:
                        err_7 = _d.sent();
                        console.log('UserService - findUserChildrens: ', err_7);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error getting user'
                        }, 500);
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.createSuperAdmin = function (createSuperAdminDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var existSuperAdmin, superAdminRole, superAdminType, userPassword, newUser, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (createSuperAdminDTO.passwordmaster !== process.env.MASTER_PASS) {
                            return [2 /*return*/, {
                                    status: 1
                                }];
                        }
                        return [4 /*yield*/, this.adminRepository.findOne({
                                where: {
                                    email: createSuperAdminDTO.email,
                                    isDeleted: false
                                }
                            })];
                    case 1:
                        existSuperAdmin = _a.sent();
                        if (existSuperAdmin) {
                            return [2 /*return*/, {
                                    status: 2
                                }];
                        }
                        return [4 /*yield*/, this.roleRepository.findOne({
                                where: {
                                    name: this.roles.SUPERADMIN
                                }
                            })];
                    case 2:
                        superAdminRole = _a.sent();
                        return [4 /*yield*/, this.roleRepository.findOne({
                                where: {
                                    name: this.types.SUPERADMIN
                                }
                            })];
                    case 3:
                        superAdminType = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, , 8]);
                        return [4 /*yield*/, bcrypt.hash(createSuperAdminDTO.password, 12)];
                    case 5:
                        userPassword = _a.sent();
                        newUser = this.superAdminRepository.create({
                            role: superAdminRole,
                            type: superAdminType,
                            name: createSuperAdminDTO.name,
                            lastname: createSuperAdminDTO.lastname,
                            email: createSuperAdminDTO.email,
                            password: userPassword
                        });
                        return [4 /*yield*/, this.superAdminRepository.save(newUser)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, { status: 0 }];
                    case 7:
                        err_8 = _a.sent();
                        console.log('UserService - create: ', err_8);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error creting users'
                        }, 500);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.updateGuest = function (updateGuestDTO) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                try {
                    // let response = {};
                    // const admin = await this.adminRepository.findOne({
                    //   where: {
                    //     uuid: updateUserDTO.adminUuid,
                    //   },
                    // });
                    // if (!admin) {
                    //   return { status: 1, msg: 'admin not found' };
                    // }
                    // const user = await this.userRepository.findOne({
                    //   relations: ['admin'],
                    //   where: { uuid: updateUserDTO.userUuid },
                    // });
                    // console.log({ user });
                    // if (!user) {
                    //   response = { status: 1, msg: 'user not found' };
                    // } else {
                    //   if (user.admin.id !== admin.id) {
                    //     return {
                    //       status: 5,
                    //       msg: 'Unauthorized',
                    //     };
                    //   }
                    //   if (updateUserDTO.name.length !== 0) {
                    //     user.name = updateUserDTO.name;
                    //   }
                    //   if (updateUserDTO.lastname.length !== 0) {
                    //     user.lastname = updateUserDTO.lastname;
                    //   }
                    //   if (updateUserDTO.avatar.length !== 0) {
                    //     user.avatar = updateUserDTO.avatar;
                    //   }
                    //   user.isActive = true;
                    //   await this.userRepository.save(user);
                    //   const userToReturn = await this.userRepository.findOne({
                    //     where: { uuid: user.uuid },
                    //   });
                    //   response = {
                    //     user: {
                    //       avatar: userToReturn.avatar,
                    //       name: userToReturn.name,
                    //       lastname: userToReturn.lastname,
                    //       email: userToReturn.email,
                    //     },
                    //   };
                    // }
                    // return response;
                }
                catch (err) {
                    console.log('UserService - updateAdmin: ', err);
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Error updating  user'
                    }, 500);
                }
                return [2 /*return*/];
            });
        });
    };
    UserService.prototype.updateAdmin = function (updateUserAdminDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var response, superadmin, user, suscription, updateSuscriptionDTO, userToReturn, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        response = {};
                        return [4 /*yield*/, this.superAdminRepository.findOne({
                                where: {
                                    uuid: updateUserAdminDTO.superAdminUuid
                                }
                            })];
                    case 1:
                        superadmin = _a.sent();
                        if (!superadmin) {
                            return [2 /*return*/, { status: 1, msg: 'supadmin not found' }];
                        }
                        return [4 /*yield*/, this.adminRepository.findOne({
                                relations: ['superadmin'],
                                where: { uuid: updateUserAdminDTO.adminUuid }
                            })];
                    case 2:
                        user = _a.sent();
                        console.log({ user: user });
                        if (!!user) return [3 /*break*/, 3];
                        response = { status: 1, msg: 'user not found' };
                        return [3 /*break*/, 8];
                    case 3:
                        if (updateUserAdminDTO.name) {
                            user.name = updateUserAdminDTO.name;
                        }
                        if (updateUserAdminDTO.lastname) {
                            user.lastname = updateUserAdminDTO.lastname;
                        }
                        if (updateUserAdminDTO.avatar) {
                            user.avatar = updateUserAdminDTO.avatar;
                        }
                        suscription = void 0;
                        if (!(updateUserAdminDTO.startedAt ||
                            updateUserAdminDTO.finishedAt ||
                            updateUserAdminDTO.cost ||
                            updateUserAdminDTO.business)) return [3 /*break*/, 5];
                        updateSuscriptionDTO = {
                            business: updateUserAdminDTO.business,
                            cost: updateUserAdminDTO.cost,
                            finishedAt: updateUserAdminDTO.finishedAt,
                            startedAt: updateUserAdminDTO.startedAt,
                            adminUuid: user.uuid
                        };
                        return [4 /*yield*/, this.suscriptionRepository.findOne({
                                select: ['cost', 'startedAt', 'finishedAt', 'isActive'],
                                where: {
                                    admin: user
                                }
                            })];
                    case 4:
                        suscription = _a.sent();
                        console.log({ suscription: suscription });
                        if (!suscription) {
                            return [2 /*return*/, {
                                    status: 1
                                }];
                        }
                        if (updateSuscriptionDTO.finishedAt) {
                            suscription.finishedAt = new Date(updateSuscriptionDTO.finishedAt);
                        }
                        if (updateSuscriptionDTO.startedAt) {
                            suscription.startedAt = new Date(updateSuscriptionDTO.startedAt);
                        }
                        if (updateSuscriptionDTO.cost && updateSuscriptionDTO.cost > 0) {
                            suscription.cost = updateSuscriptionDTO.cost;
                        }
                        this.suscriptionRepository.save(suscription);
                        _a.label = 5;
                    case 5:
                        user.isActive = true;
                        return [4 /*yield*/, this.adminRepository.save(user)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.adminRepository.findOne({
                                relations: ['type'],
                                where: { uuid: user.uuid }
                            })];
                    case 7:
                        userToReturn = _a.sent();
                        response = {
                            user: {
                                name: userToReturn.name,
                                avatar: userToReturn.avatar,
                                lastname: userToReturn.lastname,
                                email: userToReturn.email,
                                uuid: userToReturn.uuid,
                                suscription: suscription
                            }
                        };
                        _a.label = 8;
                    case 8: return [2 /*return*/, response];
                    case 9:
                        err_9 = _a.sent();
                        console.log('UserService - updateAdmin: ', err_9);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error updating  user'
                        }, 500);
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getWhoIsRequesting = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var user, isSuperAdmin, isAdmin, isGuest, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        user = void 0;
                        isSuperAdmin = request.type === this.typesNumbers.SUPERADMIN;
                        isAdmin = request.type === this.typesNumbers.ADMIN;
                        isGuest = request.type === this.typesNumbers.USER;
                        if (!isAdmin) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.adminRepository.findOne({
                                relations: ['type'],
                                where: {
                                    uuid: request.adminUuid
                                }
                            })];
                    case 1:
                        user = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!isSuperAdmin) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.superAdminRepository.findOne({
                                relations: ['type'],
                                where: {
                                    uuid: request.superAdminUuid
                                }
                            })];
                    case 3:
                        user = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!isGuest) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.userRepository.findOne({
                                relations: ['type'],
                                where: {
                                    uuid: request.userUuid
                                }
                            })];
                    case 5:
                        user = _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, { isAdmin: isAdmin, isSuperAdmin: isSuperAdmin, isGuest: isGuest, user: user }];
                    case 7:
                        err_10 = _a.sent();
                        console.log('UserService - getWhoIsRequesting: ', err_10);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error Changing Name  user'
                        }, 500);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.updateName = function (changeNameDto) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, isAdmin, isSuperAdmin, isGuest, user, err_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.getWhoIsRequesting(changeNameDto)];
                    case 1:
                        _a = _b.sent(), isAdmin = _a.isAdmin, isSuperAdmin = _a.isSuperAdmin, isGuest = _a.isGuest, user = _a.user;
                        if (!user) {
                            return [2 /*return*/, { status: 1 }];
                        }
                        user.name = changeNameDto.name;
                        if (!isAdmin) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.adminRepository.save(user)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        if (!isSuperAdmin) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.superAdminRepository.save(user)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        if (!isGuest) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [2 /*return*/, {
                            status: 0
                        }];
                    case 8:
                        err_11 = _b.sent();
                        console.log('UserService - ChangeName: ', err_11);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error Changing Name  user'
                        }, 500);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    //Actualiza el usuario loggeado
    UserService.prototype.updateUser = function (updateUserDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, isAdmin, isSuperAdmin, isGuest, user, err_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        console.log({ updateUserDTO: updateUserDTO });
                        return [4 /*yield*/, this.getWhoIsRequesting(updateUserDTO)];
                    case 1:
                        _a = _b.sent(), isAdmin = _a.isAdmin, isSuperAdmin = _a.isSuperAdmin, isGuest = _a.isGuest, user = _a.user;
                        if (!user) {
                            return [2 /*return*/, { status: 1 }];
                        }
                        if (updateUserDTO.name) {
                            console.log("Ha actualizado el nombre");
                            user.name = updateUserDTO.name;
                        }
                        if (updateUserDTO.avatar) {
                            console.log("Ha actualizado el avatar");
                            user.avatar = updateUserDTO.avatar;
                            user.thumbnail = updateUserDTO.thumbnail;
                        }
                        if (!isAdmin) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.adminRepository.save(user)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        if (!isSuperAdmin) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.superAdminRepository.save(user)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        if (!isGuest) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [2 /*return*/, {
                            status: 0,
                            user: {
                                avatar: user.avatar,
                                thumbnail: user.thumbnail,
                                name: user.name
                            }
                        }];
                    case 8:
                        err_12 = _b.sent();
                        console.log('UserService - updateAdmin: ', err_12);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error updating  user'
                        }, 500);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getTypeAndUser = function (type, adminUuid, superAdminUuid) {
        return __awaiter(this, void 0, Promise, function () {
            var userRequesting, isSuperAdmin, isAdmin, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        userRequesting = void 0;
                        isSuperAdmin = type === this.typesNumbers.SUPERADMIN;
                        isAdmin = type === this.typesNumbers.ADMIN;
                        if (!isAdmin) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.adminRepository.findOne({
                                relations: ['type'],
                                where: {
                                    uuid: adminUuid
                                }
                            })];
                    case 1:
                        userRequesting = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!isSuperAdmin) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.superAdminRepository.findOne({
                                relations: ['type'],
                                where: {
                                    uuid: superAdminUuid
                                }
                            })];
                    case 3:
                        userRequesting = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!userRequesting) {
                            return [2 /*return*/, { status: 1 }];
                        }
                        return [2 /*return*/, {
                                status: 0,
                                user: userRequesting,
                                isSuperAdmin: isSuperAdmin,
                                isAdmin: isAdmin
                            }];
                    case 5:
                        err_13 = _a.sent();
                        console.log('UserService - deleteUser: ', err_13);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error deleting user'
                        }, 500);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.deleteUserAdmin = function (deleteAdminUserDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var superAdmin, admin, assetsAdmin, assetsAdminIds, userDTO, err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.superAdminRepository.findOne({
                                where: {
                                    uuid: deleteAdminUserDTO.superAdminUuid
                                }
                            })];
                    case 1:
                        superAdmin = _a.sent();
                        if (!superAdmin) {
                            return [2 /*return*/, { status: 1, msg: 'super not found' }];
                        }
                        return [4 /*yield*/, this.adminRepository.findOne({
                                relations: ['users', 'assets'],
                                where: { uuid: deleteAdminUserDTO.adminUuidToStop }
                            })];
                    case 2:
                        admin = _a.sent();
                        if (!admin) {
                            return [2 /*return*/, { status: 2, msg: 'admin not found' }];
                        }
                        return [4 /*yield*/, this.updateArrayUsers(admin.users, { isActive: false, isDeleted: true })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.assetRepository.find({
                                where: {
                                    admin: admin
                                }
                            })];
                    case 4:
                        assetsAdmin = _a.sent();
                        assetsAdminIds = assetsAdmin.map(function (asset) { return asset.id; });
                        if (!(assetsAdminIds.length > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.assetRepository
                                .createQueryBuilder()
                                .update()
                                .set({
                                isActive: false,
                                isDeleted: true
                            })
                                .where('id IN (:...assetsAdminIds)', {
                                assetsAdminIds: assetsAdminIds
                            })
                                .execute()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        admin.isActive = false;
                        admin.isDeleted = true;
                        return [4 /*yield*/, this.adminRepository.save(admin)];
                    case 7:
                        _a.sent();
                        userDTO = new user_dto_1.UserDTO(admin);
                        return [2 /*return*/, { status: 0, admin: userDTO }];
                    case 8:
                        err_14 = _a.sent();
                        console.log('UserService - deleteUser: ', err_14);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error deleting user'
                        }, 500);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.deleteUser = function (deleteUserDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var userRequesting, isSuperAdmin, isAdmin, userToDelete, userDTO, err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        userRequesting = void 0;
                        isSuperAdmin = deleteUserDTO.type === this.typesNumbers.SUPERADMIN;
                        isAdmin = deleteUserDTO.type === this.typesNumbers.ADMIN;
                        if (!isAdmin) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.adminRepository.findOne({
                                relations: ['type'],
                                where: {
                                    uuid: deleteUserDTO.adminUuid
                                }
                            })];
                    case 1:
                        userRequesting = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!isSuperAdmin) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.superAdminRepository.findOne({
                                relations: ['type'],
                                where: {
                                    uuid: deleteUserDTO.superAdminUuid
                                }
                            })];
                    case 3:
                        userRequesting = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!userRequesting) {
                            return [2 /*return*/, { status: 1 }];
                        }
                        return [4 /*yield*/, this.userRepository.findOne({
                                relations: ['admin'],
                                where: {
                                    uuid: deleteUserDTO.userUuidToChange,
                                    superadmin: isSuperAdmin ? userRequesting : null,
                                    admin: isAdmin ? userRequesting : null
                                }
                            })];
                    case 5:
                        userToDelete = _a.sent();
                        if (!userToDelete) {
                            return [2 /*return*/, { status: 2, msg: 'user not found' }];
                        }
                        userToDelete.isActive = false;
                        userToDelete.isDeleted = true;
                        return [4 /*yield*/, this.userRepository.save(userToDelete)];
                    case 6:
                        _a.sent();
                        userDTO = new user_dto_1.UserDTO(userToDelete);
                        return [2 /*return*/, {
                                status: 0,
                                user: userDTO
                            }];
                    case 7:
                        err_15 = _a.sent();
                        console.log('UserService - deleteUser: ', err_15);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error deleting user'
                        }, 500);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.updateArrayUsers = function (users, status) {
        return __awaiter(this, void 0, Promise, function () {
            var usersIds, assetsIds, suscriptions, suscriptionsIds, assetsChildrens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        usersIds = users.map(function (user) { return user.id; });
                        assetsIds = [];
                        if (!(usersIds.length !== 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.userRepository
                                .createQueryBuilder()
                                .update()
                                .set(status)
                                .where('id IN (:...usersIds)', {
                                usersIds: usersIds
                            })
                                .execute()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.suscripctionRepository.find({
                                where: {
                                    user: typeorm_2.In(usersIds)
                                }
                            })];
                    case 2:
                        suscriptions = _a.sent();
                        suscriptionsIds = suscriptions.map(function (suscription) { return suscription.id; });
                        return [4 /*yield*/, this.suscriptionRepository
                                .createQueryBuilder()
                                .update()
                                .set(status)
                                .where('id IN (:...suscriptionsIds)', {
                                suscriptionsIds: suscriptionsIds
                            })
                                .execute()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.assetRepository.find({
                                where: {
                                    user: typeorm_2.In(usersIds)
                                }
                            })];
                    case 4:
                        assetsChildrens = _a.sent();
                        assetsIds = assetsChildrens.map(function (asset) { return asset.id; });
                        if (!(assetsIds.length > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.assetRepository
                                .createQueryBuilder()
                                .update()
                                .set(status)
                                .where('id IN (:...allAssetsIds)', {
                                assetsIds: assetsIds
                            })
                                .execute()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.suspendUserAdmin = function (pauseAdminUserDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var superAdmin, admin, suscription, userDTO, err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.superAdminRepository.findOne({
                                where: {
                                    uuid: pauseAdminUserDTO.superAdminUuid
                                }
                            })];
                    case 1:
                        superAdmin = _a.sent();
                        if (!superAdmin) {
                            return [2 /*return*/, { status: 1, msg: 'super not found' }];
                        }
                        return [4 /*yield*/, this.adminRepository.findOne({
                                relations: ['users'],
                                where: { uuid: pauseAdminUserDTO.adminUuidToStop }
                            })];
                    case 2:
                        admin = _a.sent();
                        if (!admin) {
                            return [2 /*return*/, { status: 2, msg: 'admin not found' }];
                        }
                        return [4 /*yield*/, this.updateArrayUsers(admin.users, { isActive: pauseAdminUserDTO.status, isDeleted: false })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.suscriptionRepository.findOne({
                                where: {
                                    admin: admin
                                }
                            })];
                    case 4:
                        suscription = _a.sent();
                        if (!suscription) return [3 /*break*/, 6];
                        suscription.isActive = pauseAdminUserDTO.status;
                        return [4 /*yield*/, this.suscriptionRepository.save(suscription)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        admin.isActive = pauseAdminUserDTO.status;
                        return [4 /*yield*/, this.adminRepository.save(admin)];
                    case 7:
                        _a.sent();
                        userDTO = new user_dto_1.UserDTO(admin);
                        return [2 /*return*/, { status: 0, admin: userDTO }];
                    case 8:
                        err_16 = _a.sent();
                        console.log('UserService - pauseUser: ', err_16);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error pausing user'
                        }, 500);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.suspendUser = function (pauseUserDTO) {
        return __awaiter(this, void 0, Promise, function () {
            var admin, user, suscription, userDTO, err_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.adminRepository.findOne({
                                where: {
                                    uuid: pauseUserDTO.adminUuid
                                }
                            })];
                    case 1:
                        admin = _a.sent();
                        if (!admin) {
                            return [2 /*return*/, { status: 1, msg: 'admin not found' }];
                        }
                        return [4 /*yield*/, this.userRepository.findOne({
                                relations: ['admin'],
                                where: { uuid: pauseUserDTO.userUuidToChange, admin: admin }
                            })];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, { status: 2, msg: 'user not found' }];
                        }
                        return [4 /*yield*/, this.suscriptionRepository.findOne({
                                where: {
                                    user: user
                                }
                            })];
                    case 3:
                        suscription = _a.sent();
                        user.isActive = pauseUserDTO.status;
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 4:
                        _a.sent();
                        userDTO = new user_dto_1.UserDTO(user);
                        return [2 /*return*/, { status: 0, user: userDTO }];
                    case 5:
                        err_17 = _a.sent();
                        console.log('UserService - pause user: ', err_17);
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Error pausing user'
                        }, 500);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        __param(1, common_1.Res())
    ], UserService.prototype, "findUserDetail");
    UserService = __decorate([
        common_1.Injectable(),
        __param(1, typeorm_1.InjectRepository(user_entity_1.User)),
        __param(2, typeorm_1.InjectRepository(suscription_entity_1.Suscription)),
        __param(3, typeorm_1.InjectRepository(superadmin_entity_1.SuperAdmin)),
        __param(4, typeorm_1.InjectRepository(admin_entity_1.Admin)),
        __param(5, typeorm_1.InjectRepository(token_entity_1.Token)),
        __param(6, typeorm_1.InjectRepository(asset_entity_1.Asset)),
        __param(7, typeorm_1.InjectRepository(type_entity_1.Type)),
        __param(8, typeorm_1.InjectRepository(role_entity_1.Role)),
        __param(9, typeorm_1.InjectRepository(invitation_entity_1.Invitation)),
        __param(10, typeorm_1.InjectRepository(sesion_entity_1.Sesion)),
        __param(11, typeorm_1.InjectRepository(suscription_entity_1.Suscription))
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
