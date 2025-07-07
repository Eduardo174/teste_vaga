import {
    Entity,PrimaryGeneratedColumn,Column,
    OneToOne, OneToMany, CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Conta } from '../conta/conta.entity';
import { Transacao } from '../transacao/transacao.entity';
import { TipoPerfil } from '../tipo_perfil/tipo-perfil.entity';

@Entity({ name: 'usuarios' })
export class usuarios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'no_nome' })
  nomeUsuario: string;

  @Column({ name: 'no_senha' })
  senhaHash: string;

  @Column({ default: 'status' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', precision: 0 })
  createdAt: Date;

  @OneToOne(() => Conta, conta => conta.usuario, { cascade: true })
  conta: Conta;

  @OneToMany(() => Transacao, t => t.usuarioOrigem)
  transacoesOrigem: Transacao[];

  @OneToMany(() => Transacao, t => t.usuarioDestino)
  transacoesDestino: Transacao[];

  @ManyToOne(() => TipoPerfil, perfil => perfil.usuarios, { nullable: true, eager: true })
  @JoinColumn({ name: 'id_perfil' })
  perfil?: TipoPerfil;

}