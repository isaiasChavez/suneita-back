import { SimpleRequest } from '../user/user/user.dto';
import { CreateAssetDTO, DeleteAssetDto } from './asset.dto';
import { AssetService } from './asset.service';
export declare class AssetController {
    private assetService;
    constructor(assetService: AssetService);
    getAllAssetsByUser(getAssetDTO: SimpleRequest): Promise<any>;
    create(createAssetDTO: CreateAssetDTO): Promise<any>;
    delete(deleteAssetDTO: DeleteAssetDto): Promise<any>;
}
