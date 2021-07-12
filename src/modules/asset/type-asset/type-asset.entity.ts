import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Asset } from "../asset.entity";

@Entity({ schema: "Assets" })
export class TypeAsset {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;


    @OneToMany(
        (asset) => Asset,
        (asset) => asset.typeAsset
    )
    asset: Asset[];
}
