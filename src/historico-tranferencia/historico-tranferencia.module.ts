import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricoTransferencia } from './historico-transferencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoricoTransferencia])],
  exports: [TypeOrmModule],
})
export class HistoricoTransferenciaModule {}