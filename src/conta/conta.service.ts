import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource, EntityManager } from "typeorm";
import { Conta } from "./conta.entity";
import { HistoricoTransferencia } from "../historico-tranferencia/historico-transferencia.entity";


@Injectable()
export class ContaService {
    constructor(
        @InjectRepository(Conta)
        private contaRepository: Repository<Conta>,
        private dataSource: DataSource,

        @InjectRepository(HistoricoTransferencia)
        private historicoRepository: Repository<HistoricoTransferencia>,
    ) { }

    async deposito(usuarioId: number, valor: number) {
        return this.dataSource.transaction(async (manager) => {
            const conta = await manager.findOne(Conta, { where: { usuarioId } });
            if (!conta) throw new BadRequestException("Conta não encontrada");
            if (conta.in_congelada) throw new BadRequestException("Conta congelada");
            const saldoAtual = Number(conta.saldo) || 0;
            const valorDeposito = Number(valor) || 0;
            conta.saldo = saldoAtual + valorDeposito;
            await manager.save(conta);
            return {
                usuarioId: conta.usuarioId,
                saldo: Number(conta.saldo).toFixed(2).replace('.', ','),
                conta_congelada: conta.in_congelada,
            };
        });
    }

    async transferencia(origemId: number, destinoId: number, valor: number) {
        return this.dataSource.transaction(async (manager) => {
            const contaOrigem = await manager.findOne(Conta, { where: { usuarioId: origemId } });
            const contaDestino = await manager.findOne(Conta, { where: { usuarioId: destinoId } });

            if (!contaOrigem || !contaDestino) throw new BadRequestException("Conta de origem ou destino não encontrada");
            if (contaOrigem.in_congelada) throw new BadRequestException("Conta de origem congelada");
            if (contaDestino.in_congelada) throw new BadRequestException("Conta de destino congelada");
            if (Number(contaOrigem.saldo) < Number(valor)) throw new BadRequestException("Saldo insuficiente");

            contaOrigem.saldo = Number(contaOrigem.saldo) - Number(valor);
            contaDestino.saldo = Number(contaDestino.saldo) + Number(valor);
            await manager.save([contaOrigem, contaDestino]);

            const historico = manager.create(HistoricoTransferencia, {
                origem: { id: origemId },
                destino: { id: destinoId },
                valor: Number(valor),
                inReversao: false,
            });
            await manager.save(historico);

            return {
                origem: {
                    usuarioId: contaOrigem.usuarioId,
                    saldo: Number(contaOrigem.saldo).toFixed(2).replace('.', ','),
                    conta_congelada: contaOrigem.in_congelada,
                },
                destino: {
                    usuarioId: contaDestino.usuarioId,
                    saldo: Number(contaDestino.saldo).toFixed(2).replace('.', ','),
                    conta_congelada: contaDestino.in_congelada,
                }
            };
        });
    }

    async getSaldo(usuarioId: number) {
        const conta = await this.contaRepository.findOne({
            where: { usuarioId },
            relations: ["usuario"],
        });
        if (!conta) throw new Error("Conta não encontrada");
        return {
            nome: conta.usuario.nomeUsuario,
            saldo: Number(conta.saldo).toFixed(2).replace('.', ','),
            conta_congelada: conta.in_congelada,
        };
    }

    async reverterTransacao(
        historicoId: number,
        aprovadorId: number,
        manager: EntityManager,
    ) {
        const transacao = await manager.findOne(HistoricoTransferencia, {
            where: { id: historicoId },
            relations: ['origem', 'destino'],
        });
        if (!transacao) throw new NotFoundException('Transação não encontrada');

        if (!transacao.origem || !transacao.destino) {
            throw new BadRequestException('Usuário de origem ou destino não encontrado na transação');
        }
        const origem = await manager.findOne(Conta, { where: { usuarioId: transacao.origem.id } });
        const destino = await manager.findOne(Conta, { where: { usuarioId: transacao.destino.id } });

        if (!origem) throw new BadRequestException('Conta de origem não encontrada');
        if (!destino) throw new BadRequestException('Conta de destino não encontrada');

        const saldoOrigem = Number(origem.saldo) + Number(transacao.valor);
        const saldoDestino = Number(destino.saldo) - Number(transacao.valor);

        origem.saldo = +saldoOrigem.toFixed(2);
        destino.saldo = +saldoDestino.toFixed(2);
        if (destino.saldo < 0) throw new BadRequestException('Transferência não pode resultar em saldo negativo');

        await manager.save([origem, destino]);

        const reversao = manager.create(HistoricoTransferencia, {
            origem: transacao.destino,
            destino: transacao.origem,
            valor: transacao.valor,
            inReversao: true,
            aprovador: { id: aprovadorId },
        });
        await manager.save(reversao);

        return { transacaoReversa: reversao.id };
    }
}