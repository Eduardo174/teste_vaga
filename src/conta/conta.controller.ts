import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { ContaService } from "./conta.service";

class DepositoDto {
    usuarioId: number;
    valor: number;
}

class TransferenciaDto {
    origemId: number;
    destinoId: number;
    valor: number;
}

@Controller("contas")
export class ContaController {
    constructor(private svc: ContaService) { }

    @Post("deposito")
    async deposito(@Body() depositoDto: DepositoDto) {
        return this.svc.deposito(depositoDto.usuarioId, depositoDto.valor);
    }

    @Post("transferencia")
    async transferencia(@Body() transferenciaDto: TransferenciaDto) {
        return this.svc.transferencia(
            transferenciaDto.origemId,
            transferenciaDto.destinoId,
            transferenciaDto.valor
        );
    }

    @Get("saldo/:usuarioId")
    async getSaldo(@Param("usuarioId") usuarioId: number) {
        return this.svc.getSaldo(usuarioId);
    }
}