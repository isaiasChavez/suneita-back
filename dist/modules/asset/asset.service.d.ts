import { Repository } from 'typeorm';
import { Admin } from '../user/user/admin.entity';
import { CreateAssetDTO, DeleteAssetDto, GetAssetDTO } from './asset.dto';
import { Asset } from './asset.entity';
import { User } from '../user/user/user.entity';
import { TypeAsset } from './type-asset/type-asset.entity';
export declare class AssetService {
    private adminRepository;
    private userRepository;
    private assetRepository;
    private typeAssetRepository;
    constructor(adminRepository: Repository<Admin>, userRepository: Repository<User>, assetRepository: Repository<Asset>, typeAssetRepository: Repository<TypeAsset>);
    getAllAssetsByUser(getAssetDTO: GetAssetDTO): Promise<any>;
    create(createAssetDTO: CreateAssetDTO): Promise<any>;
    delete(deleteAssetDto: DeleteAssetDto): Promise<any>;
}
