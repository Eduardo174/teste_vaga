
import {Entity, PrimaryColumn, Column,OneToOne, JoinColumn,} from 'typeorm';
import { usuarios } from '../usuario/usuario.entity';

@Entity({ name: 'conta' })
export class Conta {
  @PrimaryColumn({ name: 'usuario_id' })
  usuarioId: number;

  @Column('numeric', { precision: 15, scale: 2, default: 0 })
  saldo: number;

  @Column({ default: false })
  in_congelada: boolean;

  @OneToOne(() => usuarios, usuario => usuario.conta)
  @JoinColumn({ name: 'usuario_id' })
  usuario: usuarios;
}
