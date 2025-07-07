import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitacao } from './solicitacao.entity';
import { SolicitacaoService } from './solicitacao.service';
import { SolicitacaoController } from './solicitacao.controller';
import { ContaModule } from '../conta/conta.module';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Solicitacao]),
        ContaModule,
        UsuarioModule,    
    ],
    providers: [SolicitacaoService],
    controllers: [SolicitacaoController],
})
export class SolicitacaoModule { }