import { Controller, Post, Body, UseGuards, Request, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

class LoginDto {
    username: string;
    password: string;
}

class RegisterDto {
    username: string;
    password: string;
}

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("registro")
    async registro(@Body() registerDto: RegisterDto) {
        try {
            await this.authService.registro(
                registerDto.username,
                registerDto.password
            );
            return { message: "Registro realizado com sucesso" };
        } catch (error) {
            throw new BadRequestException(error.message || "Erro ao registrar usuário");
        }
    }

    @Post("login")
    async login(@Body() loginDto: LoginDto) {
        try {
            const user = await this.authService.verificaCredenciais(
                loginDto.username,
                loginDto.password
            );
            const token = await this.authService.login(user);
            return { access_token: token.access_token, message: "Login realizado com sucesso" };
        } catch (error) {
            throw new UnauthorizedException(error.message || "Usuário ou senha inválidos");
        }
    }

    @UseGuards(AuthGuard("jwt"))
    @Post("profile")
    getProfile(@Request() req) {
        return req.user;
    }
}