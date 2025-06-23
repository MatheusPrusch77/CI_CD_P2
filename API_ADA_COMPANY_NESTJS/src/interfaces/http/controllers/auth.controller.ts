import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../../application/auth/auth.service';
import { Public } from '../decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthResponseDto } from '../dtos/responses/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Gerar token para teste' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token gerado com sucesso',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      }
    }
  })
  @Public()
  @Get('token')
  getToken(): { token: string } {
    const token = this.authService.gerarTokenValido();
    return { token };
  }

  @ApiOperation({ summary: 'Login de usuário (cliente ou funcionário)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@email.com' },
        senha: { type: 'string', example: 'senha123' }
      },
      required: ['email', 'senha']
    },
    description: 'Credenciais do usuário (cliente ou funcionário)'
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas'
  })
  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { email: string; senha: string }) {
    return this.authService.login(body);
  }
} 