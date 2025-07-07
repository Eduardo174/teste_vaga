
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transacao } from './transacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transacao])],
  exports: [],
})
export class TransacaoModule {}
