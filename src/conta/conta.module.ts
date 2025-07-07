import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Conta } from "./conta.entity";
import { ContaService } from "./conta.service";
import { ContaController } from "./conta.controller";
import { TransacaoModule } from "../transacao/transacao.module";
import { HistoricoTransferenciaModule } from "../historico-tranferencia/historico-tranferencia.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Conta]),
        TransacaoModule,
        HistoricoTransferenciaModule
    ],
    providers: [ContaService],
    controllers: [ContaController],
    exports: [ContaService]
})
export class ContaModule { }