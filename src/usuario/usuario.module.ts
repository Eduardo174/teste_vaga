import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { usuarios } from "./usuario.entity";
import { UsuarioService } from "./usuario.service";
import { UsuarioController } from "./usuario.controller";
import { Conta } from "../conta/conta.entity";
import { TipoPerfilModule } from "../tipo_perfil/tipo-perfil.module";

@Module({
    imports: [TypeOrmModule.forFeature([usuarios, Conta, TipoPerfilModule])],
    controllers: [UsuarioController],
    providers: [UsuarioService],
    exports: [UsuarioService],
})
export class UsuarioModule {}