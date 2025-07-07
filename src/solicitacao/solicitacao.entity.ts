import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { usuarios } from "../usuario/usuario.entity";

@Entity({ name: 'solicitacao' })
export class Solicitacao {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => usuarios, { nullable: false })
    @JoinColumn({ name: 'id_origem' })
    origem: usuarios;

    @ManyToOne(() => usuarios, { nullable: false })
    @JoinColumn({ name: 'id_destino' })
    destino: usuarios;

    @Column('numeric', { precision: 15, scale: 2 })
    valor: number;

    @CreateDateColumn({ name: 'dt_tranferencia' })
    dtTranseferencia: Date;
}