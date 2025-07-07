import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsuarioService } from "../usuario/usuario.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService,
    ) {}

    async verificaCredenciais(nomeUsuario: string, senha: string) {
        const usuario = await this.usuarioService.findByNome(nomeUsuario);
        if (!usuario) throw new UnauthorizedException('Usuário não encontrado');

        const validarSenha = await bcrypt.compare(senha, usuario.senhaHash);
        if (!validarSenha) throw new UnauthorizedException('Senha inválida');

        return usuario;
    }

    login(user: any) {
        const payload = { id: user.id, nomeUsuario: user.nomeUsuario };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async registro(nomeUsuario: string, senha: string) {        
        const hash = await bcrypt.hash(senha, 10);
        const usuario = await this.usuarioService.criar(nomeUsuario, hash);
        return this.login(usuario);
    }
}

