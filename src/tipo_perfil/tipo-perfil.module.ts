import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoPerfil } from './tipo-perfil.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoPerfil])],
  exports: [TypeOrmModule],
})
export class TipoPerfilModule {}
