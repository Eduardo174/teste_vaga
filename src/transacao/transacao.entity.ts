import {Entity, PrimaryGeneratedColumn, Column,ManyToOne, JoinColumn, OneToMany, CreateDateColumn,} from 'typeorm';
import { usuarios } from '../usuario/usuario.entity';

@Entity({ name: 'transacao' })
export class Transacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  tipo: 'deposito' | 'transferencia' | 'reversao';

  @Column('numeric', { precision: 15, scale: 2 })
  valor: number;

  @ManyToOne(() => usuarios, u => u.transacoesOrigem, { nullable: true })
  @JoinColumn({ name: 'usuario_origem_id' })
  usuarioOrigem?: usuarios;

  @ManyToOne(() => usuarios, u => u.transacoesDestino, { nullable: true })
  @JoinColumn({ name: 'usuario_destino_id' })
  usuarioDestino?: usuarios;

  @ManyToOne(() => Transacao, t => t.reversoes, { nullable: true })
  @JoinColumn({ name: 'transacao_relacionada_id' })
  transacaoRelacionada?: Transacao;

  @OneToMany(() => Transacao, t => t.transacaoRelacionada)
  reversoes: Transacao[];

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;
}
