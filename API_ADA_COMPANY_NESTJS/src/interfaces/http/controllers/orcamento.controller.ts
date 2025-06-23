import { Controller, Get, Post, Body, Param, Put, Delete, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { CreateOrcamentoDto } from '../../../interfaces/http/dtos/requests/create-orcamento.dto';
import { UpdateOrcamentoDto } from '../../../interfaces/http/dtos/requests/update-orcamento.dto';
import { OrcamentoResponseDto } from '../../../interfaces/http/dtos/responses/orcamento-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { FuncionarioGuard } from '../guards/funcionario.guard';
import { CreateOrcamentoUseCase } from '../../../application/use-cases/orcamento/create-orcamento.use-case';
import { ListOrcamentosUseCase } from '../../../application/use-cases/orcamento/list-orcamentos.use-case';
import { GetOrcamentoUseCase } from '../../../application/use-cases/orcamento/get-orcamento.use-case';
import { UpdateOrcamentoUseCase } from '../../../application/use-cases/orcamento/update-orcamento.use-case';
import { DeleteOrcamentoUseCase } from '../../../application/use-cases/orcamento/delete-orcamento.use-case';
import { Orcamento as OrcamentoModel } from '../../../domain/models/orcamento.model';
import { NotFoundException, ConflictException } from '@nestjs/common';
import logger from 'src/infrastructure/logger/logger.service';

@ApiTags('orcamentos')
@ApiBearerAuth()
@Controller('orcamentos')
@UseGuards(FuncionarioGuard)
export class OrcamentoController {
  constructor(
    private readonly createOrcamentoUseCase: CreateOrcamentoUseCase,
    private readonly listOrcamentosUseCase: ListOrcamentosUseCase,
    private readonly getOrcamentoUseCase: GetOrcamentoUseCase,
    private readonly updateOrcamentoUseCase: UpdateOrcamentoUseCase,
    private readonly deleteOrcamentoUseCase: DeleteOrcamentoUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo orçamento' })
  @ApiBody({
    type: CreateOrcamentoDto,
    description: 'Dados para criar um novo orçamento',
    examples: {
      example1: {
        summary: 'Exemplo de criação de orçamento',
        value: {
          valor_orcamento: 2000.00,
          data_orcamento: '2023-10-26T10:00:00Z',
          data_validade: '2023-11-26T10:00:00Z',
          id_pacote: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Orçamento criado com sucesso',
    type: OrcamentoResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pacote não encontrado'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Já existe orçamento para este pacote'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Erro interno do servidor'
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Token não fornecido ou inválido' 
  })
  async create(@Body() createOrcamentoDto: CreateOrcamentoDto) {
    try {
      const orcamento = await this.createOrcamentoUseCase.execute(createOrcamentoDto);
      logger.info(`Orçamento criado com sucesso: ${JSON.stringify(orcamento)}`);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Orçamento criado com sucesso',
        data: orcamento,
      };
    } catch (error) {
      logger.error(`Erro ao criar orçamento: ${error.message}`, { context: 'OrcamentoController', stack: error.stack });
      if (error instanceof NotFoundException) {
        throw new HttpException({ statusCode: HttpStatus.NOT_FOUND, message: error.message }, HttpStatus.NOT_FOUND);
      } else if (error instanceof ConflictException) {
        throw new HttpException({ statusCode: HttpStatus.CONFLICT, message: error.message }, HttpStatus.CONFLICT);
      } else {
        throw new HttpException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Erro ao criar orçamento: ${error.message}`,
          error: error.name,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os orçamentos' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de orçamentos retornada com sucesso',
    type: OrcamentoResponseDto,
    isArray: true
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Token não fornecido ou inválido' 
  })
  async findAll() {
    try {
      const orcamentos = await this.listOrcamentosUseCase.execute();
      logger.info(`Listagem de orçamentos realizada com sucesso. Total: ${orcamentos.length}`);
      return {
        statusCode: HttpStatus.OK,
        message: 'Orçamentos encontrados com sucesso',
        data: orcamentos.map(orcamento => this.toOrcamentoResponseDto(orcamento)),
      };
    } catch (error) {
      logger.error(`Erro ao listar orçamentos: ${error.message}`, { context: 'OrcamentoController', stack: error.stack });
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Erro ao listar orçamentos: ${error.message}`,
        error: error.name,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar orçamento por ID' })
  @ApiParam({ name: 'id', description: 'ID do orçamento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Orçamento encontrado com sucesso',
    type: OrcamentoResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Orçamento não encontrado'
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Token não fornecido ou inválido' 
  })
  async findOne(@Param('id') id: string) {
    try {
      const orcamento = await this.getOrcamentoUseCase.execute(id);
      if (!orcamento) {
        throw new HttpException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Orçamento não encontrado',
        }, HttpStatus.NOT_FOUND);
      }
      logger.info(`Orçamento encontrado com sucesso: ${JSON.stringify(orcamento)}`);
      return this.toOrcamentoResponseDto(orcamento);
    } catch (error) {
       logger.error(`Erro ao buscar orçamento por ID ${id}: ${error.message}`, { context: 'OrcamentoController', stack: error.stack });
        // Aqui você pode adicionar lógica para tratar erros específicos dos use-cases,
        // como NotFoundException
        throw new HttpException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Erro ao buscar orçamento: ${error.message}`,
          error: error.name,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um orçamento' })
  @ApiParam({ name: 'id', description: 'ID do orçamento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Orçamento atualizado com sucesso',
    type: OrcamentoResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Orçamento não encontrado'
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Token não fornecido ou inválido' 
  })
  async update(
    @Param('id') id: string,
    @Body() updateOrcamentoDto: UpdateOrcamentoDto,
  ) {
    try {
      const [affectedCount, affectedRows] = await this.updateOrcamentoUseCase.execute(id, updateOrcamentoDto);

      if (affectedCount === 0) {
        throw new HttpException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Orçamento não encontrado para atualização',
        }, HttpStatus.NOT_FOUND);
      }

      // Retorna o orçamento atualizado. Assumindo que affectedRows contém o orçamento atualizado.
      // Se o use-case de update retornar apenas affectedCount, você precisaria buscar o orçamento novamente
      const updatedOrcamento = affectedRows[0];
      logger.info(`Orçamento atualizado com sucesso: ${JSON.stringify(updatedOrcamento)}`);
      return this.toOrcamentoResponseDto(updatedOrcamento);

    } catch (error) {
       logger.error(`Erro ao atualizar orçamento com ID ${id}: ${error.message}`, { context: 'OrcamentoController', stack: error.stack });
       // Aqui você pode adicionar lógica para tratar erros específicos dos use-cases
        throw new HttpException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Erro ao atualizar orçamento: ${error.message}`,
          error: error.name,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um orçamento' })
  @ApiParam({ name: 'id', description: 'ID do orçamento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Orçamento removido com sucesso'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Orçamento não encontrado'
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Token não fornecido ou inválido' 
  })
  async remove(@Param('id') id: string) {
     try {
      await this.deleteOrcamentoUseCase.execute(id);
      logger.info(`Orçamento removido com sucesso: ID ${id}`);
      return { 
        statusCode: HttpStatus.OK,
        message: 'Orçamento removido com sucesso' 
      };
     } catch (error) {
       logger.error(`Erro ao remover orçamento com ID ${id}: ${error.message}`, { context: 'OrcamentoController', stack: error.stack });
        // Aqui você pode adicionar lógica para tratar erros específicos dos use-cases,
        // como NotFoundException
        throw new HttpException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Erro ao remover orçamento: ${error.message}`,
          error: error.name,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
     }
  }

  private toOrcamentoResponseDto(orcamento: OrcamentoModel): OrcamentoResponseDto {
    return {
      cod_orcamento: orcamento.cod_orcamento,
      valor_orcamento: orcamento.valor_orcamento,
      data_orcamento: orcamento.data_orcamento,
      data_validade: orcamento.data_validade,
      id_pacote: orcamento.id_pacote,
      id_cliente: (orcamento as any).id_cliente,
      pacote: (orcamento as any).pacote,
      cliente: (orcamento as any).cliente
    };
  }
}