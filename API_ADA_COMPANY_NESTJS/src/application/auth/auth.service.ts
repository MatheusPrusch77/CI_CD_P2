import { Injectable, UnauthorizedException, Logger, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { FuncionarioRepository } from '../../domain/repositories/funcionario.repository.interface';
import { GetClienteByEmailUseCase } from '../use-cases/cliente/get-cliente-by-email.use-case';
import { GetFuncionarioByEmailUseCase } from '../use-cases/funcionario/get-funcionario-by-email.use-case';
import { InjectModel } from '@nestjs/sequelize';
import { Usuario } from '../../infrastructure/database/entities/usuario.entity';
import { UsuarioRepository } from '../../infrastructure/database/repositories/usuario.repository';
import { FUNCIONARIO_REPOSITORY } from '../../infrastructure/providers/funcionario.provider';
import logger from 'src/infrastructure/logger/logger.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(Usuario)
    private usuarioModel: typeof Usuario,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(FUNCIONARIO_REPOSITORY)
    private funcionarioRepository: FuncionarioRepository,
    private getClienteByEmailUseCase: GetClienteByEmailUseCase,
    private usuarioRepository: UsuarioRepository,
    private getFuncionarioByEmailUseCase: GetFuncionarioByEmailUseCase
  ) { }

  private getJwtSecret(): string {
    return process.env.NODE_ENV === 'test'
      ? 'test-secret-key'
      : this.configService.get<string>('JWT_SECRET');
  }

  gerarTokenValido(): string {
    const payload = { id_usuario: 123, tipo_usuario: 'admin' };
    const secret = this.configService.get<string>('JWT_SECRET');

    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: '1h',
    });
  }

  async login({ email, senha }: { email: string; senha: string }) {
    const usuario = await this.usuarioRepository.findByEmail(email);
    const isPasswordValid = usuario && usuario.senha ? await bcrypt.compare(senha, usuario.senha) : false;
  
    if (!usuario || !isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
  
    // Se for funcionário, verifica se existe na tabela de funcionários
    if (usuario.tipo_usuario === 'funcionario') {
      try {
        const funcionario = await this.getFuncionarioByEmailUseCase.execute(email);
        if (!funcionario) {
          throw new UnauthorizedException('Funcionário não encontrado no sistema');
        }
      } catch (error) {
        logger.error('Mensagem de erro', { extra: 'dados' });
        throw new UnauthorizedException('Erro ao verificar credenciais de funcionário');
      }
    }
  
    // Se for cliente, verifica se existe na tabela de clientes
    if (usuario.tipo_usuario === 'cliente') {
      try {
        const cliente = await this.getClienteByEmailUseCase.execute(email);
        if (!cliente) {
          throw new UnauthorizedException('Cliente não encontrado no sistema');
        }
      } catch (error) {
        logger.error('Mensagem de erro', { extra: 'dados' });
        throw new UnauthorizedException('Erro ao verificar credenciais de cliente');
      }
    }
  
    const payload = {
      id_usuario: String(usuario.id_usuario),
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario
    };
  
    return {
      token: this.jwtService.sign(payload, {
        secret: this.getJwtSecret(),
        expiresIn: '1h'
      }),
      user: {
        id: String(usuario.id_usuario),
        nome: usuario.nome_completo,
        email: usuario.email,
        tipo: usuario.tipo_usuario
      }
    };
  }

  async validateUser(payload: any) {
    const usuario = await this.usuarioRepository.findOne(payload.id_usuario);

    if (!usuario) {
      return null;
    }

    if (usuario.tipo_usuario === payload.tipo_usuario) {
      return {
        id_usuario: String(usuario.id_usuario),
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
        nome: usuario.nome_completo
      };
    }

    return null;
  }
} 