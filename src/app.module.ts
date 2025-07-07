import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { ContaModule } from './conta/conta.module';
import { TransacaoModule } from './transacao/transacao.module';
import { AuthModule } from './auth/auth.module';
import { HistoricoTransferenciaModule } from './historico-tranferencia/historico-tranferencia.module';
import { TipoPerfilModule } from './tipo_perfil/tipo-perfil.module';
import { SolicitacaoModule } from './solicitacao/solicitacao.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsuarioModule,
    ContaModule,
    TransacaoModule,
    AuthModule,
    HistoricoTransferenciaModule,
    TipoPerfilModule,
    SolicitacaoModule,
  ],
  
})
export class AppModule {}
