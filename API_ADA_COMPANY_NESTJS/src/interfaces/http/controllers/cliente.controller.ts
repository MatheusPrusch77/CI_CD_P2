import { Controller, Get, Post, Body, Param, Put, Delete, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { Public } from '../../http/decorators/public.decorator';
import { CreateClienteDto } from '../dtos/requests/create-cliente.dto';
import { UpdateClienteDto } from '../dtos/requests/update-cliente.dto';
import { ClienteResponseDto } from '../dtos/responses/cliente-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SelfAccessGuard } from '../guards/self-access.guard';
import { FuncionarioGuard } from '../guards/funcionario.guard';
import { CreateClienteUseCase } from '../../../application/use-cases/cliente/create-cliente.use-case';
import { ListClientesUseCase } from '../../../application/use-cases/cliente/list-clientes.use-case';
import { GetClienteUseCase } from '../../../application/use-cases/cliente/get-cliente.use-case';
import { UpdateClienteUseCase } from '../../../application/use-cases/cliente/update-cliente.use-case';
import { DeleteClienteUseCase } from '../../../application/use-cases/cliente/delete-cliente.use-case';
import logger from 'src/infrastructure/logger/logger.service';

@ApiTags('clientes')
@ApiBearerAuth()
@Controller('clientes')
export class ClienteController {
  constructor(
    private readonly createClienteUseCase: CreateClienteUseCase,
    private readonly listClientesUseCase: ListClientesUseCase,
    private readonly getClienteUseCase: GetClienteUseCase,
    private readonly updateClienteUseCase: UpdateClienteUseCase,
    private readonly deleteClienteUseCase: DeleteClienteUseCase,
  ) {}

  @Public()
  @Post('cadastro')
  @ApiOperation({ summary: 'Cadastro de novo cliente' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Cliente cadastrado com sucesso',
    type: ClienteResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos fornecidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Email ou CNPJ já cadastrado' 
  })
  async cadastro(@Body() createClienteDto: CreateClienteDto) {
    try {
      const cliente = await this.createClienteUseCase.execute(createClienteDto);
      logger.info(`Cliente cadastrado com sucesso: ${JSON.stringify(cliente)}`);
      return this.toClienteResponseDto(cliente);
    } catch (error) {
      logger.error(`Erro ao cadastrar cliente: ${error.message}`, { context: 'ClienteController', stack: error.stack });
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Erro ao cadastrar cliente: ${error.message}`,
        error: error.name,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(FuncionarioGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes (apenas funcionários)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de clientes retornada com sucesso',
    type: ClienteResponseDto,
    isArray: true
  })
  async findAll() {
    try {
      const clientes = await this.listClientesUseCase.execute();
      logger.info(`Listagem de clientes realizada com sucesso. Total: ${clientes.length}`);
      return {
        statusCode: HttpStatus.OK,
        message: 'Clientes encontrados com sucesso',
        data: clientes.map(this.toClienteResponseDto),
      };
    } catch (error) {
      logger.error(`Erro ao listar clientes: ${error.message}`, { context: 'ClienteController', stack: error.stack });
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Erro ao listar clientes: ${error.message}`,
        error: error.name,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(FuncionarioGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID (apenas funcionários)' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cliente encontrado com sucesso',
    type: ClienteResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cliente não encontrado'
  })
  async findOne(@Param('id') id: string) {
    try {
      const cliente = await this.getClienteUseCase.execute(id);
      if (!cliente) {
        throw new HttpException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Cliente não encontrado',
        }, HttpStatus.NOT_FOUND);
      }
      logger.info(`Cliente encontrado com sucesso: ${JSON.stringify(cliente)}`);
      return {
        statusCode: HttpStatus.OK,
        message: 'Cliente encontrado com sucesso',
        data: this.toClienteResponseDto(cliente),
      };
    } catch (error) {
      logger.error(`Erro ao buscar cliente: ${error.message}`, { context: 'ClienteController', stack: error.stack });
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Erro ao buscar cliente: ${error.message}`,
        error: error.name,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(SelfAccessGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados do cliente (cliente próprio ou funcionário)' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cliente atualizado com sucesso',
    type: ClienteResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cliente não encontrado'
  })
  async update(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    try {
      const cliente = await this.updateClienteUseCase.execute(id, updateClienteDto);
      logger.info(`Cliente atualizado com sucesso: ${JSON.stringify(cliente)}`);
      return {
        statusCode: HttpStatus.OK,
        message: 'Cliente atualizado com sucesso',
        data: this.toClienteResponseDto(cliente),
      };
    } catch (error) {
      logger.error(`Erro ao atualizar cliente: ${error.message}`, { context: 'ClienteController', stack: error.stack });
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Erro ao atualizar cliente: ${error.message}`,
        error: error.name,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(FuncionarioGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um cliente (apenas funcionários)' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cliente removido com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cliente não encontrado' 
  })
  async remove(@Param('id') id: string) {
    try {
      await this.deleteClienteUseCase.execute(id);
      logger.info(`Cliente removido com sucesso: ID ${id}`);
      return {
        statusCode: HttpStatus.OK,
        message: 'Cliente removido com sucesso',
      };
    } catch (error) {
      logger.error(`Erro ao remover cliente: ${error.message}`, { context: 'ClienteController', stack: error.stack });
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Erro ao remover cliente: ${error.message}`,
        error: error.name,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private toClienteResponseDto(cliente: any): ClienteResponseDto {
    return {
      id_cliente: cliente.id_cliente,
      nome_completo: cliente.nome_completo,
      cnpj: cliente.cnpj,
      telefone: cliente.telefone,
      email: cliente.email,
      id_usuario: cliente.id_usuario,
      createdAt: cliente.createdAt,
      updatedAt: cliente.updatedAt,
    };
  }
}