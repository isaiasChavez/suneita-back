"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMiddleware = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("../../types");
const jwt = require('jsonwebtoken');
let UserMiddleware = class UserMiddleware {
    use(req, res, next) {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ msg: 'No hay token, permiso no valido' });
        }
        try {
            const cifrado = jwt.verify(token, process.env.SECRETA);
            req.body.adminUuid = null;
            req.body.superAdminUuid = null;
            if (cifrado.usuario.type === types_1.ADMIN) {
                req.body.adminUuid = cifrado.usuario.uuid;
            }
            if (cifrado.usuario.type === types_1.SUPER_ADMIN) {
                req.body.superAdminUuid = cifrado.usuario.uuid;
            }
            req.body.type = cifrado.usuario.type;
            next();
        }
        catch (error) {
            res.status(401).json({ msg: 'token no valido' });
        }
    }
};
UserMiddleware = __decorate([
    common_1.Injectable()
], UserMiddleware);
exports.UserMiddleware = UserMiddleware;
//# sourceMappingURL=user.middleware.js.map