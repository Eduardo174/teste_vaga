import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { usuarios } from "./usuario.entity";
import { Conta } from "../conta/conta.entity";

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(usuarios)
        private repository: Repository<usuarios>,
        @InjectRepository(Conta)
        private contaRepository: Repository<Conta>
    ) {}

     async criar(nomeUsuario: string, senhaHash: string): Promise<usuarios> {
        const usuario = this.repository.create({ nomeUsuario, senhaHash, status: 'ativo' });
        const usuarioSalvo = await this.repository.save(usuario);

        const conta = this.contaRepository.create({
            usuarioId: usuarioSalvo.id,
            saldo: 0,
            in_congelada: false,
        });
        await this.contaRepository.save(conta);

        return usuarioSalvo;
    }

    async findById(id: number) {
        return this.repository.findOne({
            where: { id },
            relations: ['conta'],
        });
    }

    async findByNome(nomeUsuario: string) {
        return this.repository.findOne({
            where: { nomeUsuario },
        });
    }
}