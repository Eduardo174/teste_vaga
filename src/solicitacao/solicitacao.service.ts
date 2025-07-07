import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Solicitacao } from './solicitacao.entity';
import { UsuarioService } from '../usuario/usuario.service';
import { ContaService } from '../conta/conta.service';

@Injectable()
export class SolicitacaoService {
    constructor(
        @InjectRepository(Solicitacao)
        private repo: Repository<Solicitacao>,
        private usuarioService: UsuarioService,
        private contaService: ContaService,
        private dataSource: DataSource,
    ) { }

    findAll(): Promise<Solicitacao[]> {
        return this.repo.find({ relations: ['origem', 'destino'] });
    }

    async approve(body: {
        idUsuarioAprovador: number;
        idTransacao: number;
        aprovado: boolean;
    }) {
        const { idUsuarioAprovador, idTransacao, aprovado } = body;

        // 1) só perfil=1 pode aprovar
        const user = await this.usuarioService.findById(idUsuarioAprovador);
        console.log(user);
        
        if (!user || !user.perfil || user.perfil.idPerfil !== 1) {
            throw new ForbiddenException('Somente perfil 1 pode aprovar reversões');
        }
        if (!aprovado) {
            return { message: 'Reversão não aprovada' };
        }

        // 2) executa a reversão dentro de transação
        return this.dataSource.transaction(async manager => {
            // use seu serviço de conta para reverter: 
            // você pode expor aqui um método reverterTransacao()
            const result = await this.contaService.reverterTransacao(
                idTransacao,
                idUsuarioAprovador,
                manager,
            );
            return { message: 'Reversão realizada com sucesso', ...result };
        });
    }
}