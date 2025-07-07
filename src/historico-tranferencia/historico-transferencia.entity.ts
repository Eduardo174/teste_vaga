import { usuarios } from "../usuario/usuario.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity({ name: 'historico_transferencia' })
export class HistoricoTransferencia {
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

  @CreateDateColumn({ name: 'dt_transferencia' })
  dtTransferencia: Date;

  @Column({ name: 'in_reversao', default: false })
  inReversao: boolean;

  @ManyToOne(() => usuarios, { nullable: true })
  @JoinColumn({ name: 'id_aprovador' })
  aprovador?: usuarios;

}