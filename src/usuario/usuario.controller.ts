import { Controller, Post, Body } from "@nestjs/common";
import { UsuarioService } from "./usuario.service";

class CreateUsuarioDto {
    nomeUsuario: string;
    senhaHash: string;
}

@Controller('usuarios')
export class UsuarioController {
    constructor(private svc: UsuarioService) {}

    @Post()
    create(@Body() dto: CreateUsuarioDto) {
        return this.svc.criar(dto.nomeUsuario, dto.senhaHash);
    }
}