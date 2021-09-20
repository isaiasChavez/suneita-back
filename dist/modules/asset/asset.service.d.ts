import { Repository } from 'typeorm';
import { Admin } from '../user/user/admin.entity';
import { CreateAssetDTO, DeleteAssetDto } from './asset.dto';
import { Asset } from './asset.entity';
import { User } from '../user/user/user.entity';
import { TypeAsset } from './type-asset/type-asset.entity';
import { UserService } from '../user/user/user.service';
import { SimpleRequest } from '../user/user/user.dto';
export declare class AssetService {
    private readonly userService;
    private adminRepository;
    private userRepository;
    private assetRepository;
    private typeAssetRepository;
    constructor(userService: UserService, adminRepository: Repository<Admin>, userRepository: Repository<User>, assetRepository: Repository<Asset>, typeAssetRepository: Repository<TypeAsset>);
    types: {
        IMAGE: number;
        IMAGE360: number;
        VIDEO: number;
        VIDEO360: number;
    };
    getAllAssetsByUser(getAssetDTO: SimpleRequest): Promise<any>;
    create(createAssetDTO: CreateAssetDTO): Promise<any>;
    delete(deleteAssetDto: DeleteAssetDto): Promise<any>;
}
