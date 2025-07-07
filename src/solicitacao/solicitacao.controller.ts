import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SolicitacaoService } from './solicitacao.service';

@Controller('solicitacoes')
export class SolicitacaoController {
    constructor(private svc: SolicitacaoService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    listAll() {
        return this.svc.findAll();
    }

    @Post('aprovar')
    @UseGuards(AuthGuard('jwt'))
    approve(@Body() dto: {
        idUsuarioAprovador: number;
        idTransacao: number;
        aprovado: boolean;
    }) {
        return this.svc.approve(dto);
    }
}