import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { usuarios } from '../usuario/usuario.entity';

@Entity({ name: 'tipo_perfil' })
export class TipoPerfil {
  @PrimaryGeneratedColumn({ name: 'id_perfil' })
  idPerfil: number;

  @Column({ name: 'no_perfil', length: 50 })
  nomePerfil: string;

  @OneToMany(() => usuarios, usuario => usuario.perfil)
  usuarios: usuarios[];
}
