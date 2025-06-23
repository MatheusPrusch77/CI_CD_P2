import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus, UseGuards, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreateContratoDto, StatusContrato } from '../../../interfaces/http/dtos/requests/create-contrato.dto';
import { UpdateContratoDto } from '../../../interfaces/http/dtos/requests/update-contrato.dto';
import { ContratoResponseDto } from '../../../interfaces/http/dtos/responses/contrato-response.dto';
import { FuncionarioGuard } from '../guards/funcionario.guard';
import { CreateContratoUseCase } from '../../../application/use-cases/contrato/create-contrato.use-case';
import { ListContratosUseCase } from '../../../application/use-cases/contrato/list-contratos.use-case';
import { GetContratoUseCase } from '../../../application/use-cases/contrato/get-contrato.use-case';
import { UpdateContratoUseCase } from '../../../application/use-cases/contrato/update-contrato.use-case';
import { DeleteContratoUseCase } from '../../../application/use-cases/contrato/delete-contrato.use-case';
import { Contrato as ContratoModel } from '../../../domain/models/contrato.model';
import logger from 'src/infrastructure/logger/logger.service';

@ApiTags('contratos')
@ApiBearerAuth()
@Controller('contratos')
@UseGuards(FuncionarioGuard)
export class ContratoController {
  constructor(
    private readonly createContratoUseCase: CreateContratoUseCase,
    private readonly listContratosUseCase: ListContratosUseCase,
    private readonly getContratoUseCase: GetContratoUseCase,
    private readonly updateContratoUseCase: UpdateContratoUseCase,
    private readonly deleteContratoUseCase: DeleteContratoUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo contrato' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Contrato criado com sucesso',
    type: ContratoResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos fornecidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Já existe um contrato para este orçamento' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Token não fornecido ou inválido' 
  })
  async create(@Body() createContratoDto: CreateContratoDto) {
     try {
      const contrato = await this.createContratoUseCase.execute(createContratoDto);
      logger.info(`Contrato criado com sucesso: ${JSON.stringify(contrato)}`);
      return this.toContratoResponseDto(contrato);
     } catch (error) {
        logger.error(`Erro ao criar contrato: ${error.message}`, { context: 'ContratoController', stack: error.stack });
        // Aqui você pode adicionar lógica para tratar erros específicos dos use-cases,
        // como BadRequestException ou ConflictException
        throw new HttpException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Erro ao criar contrato: ${error.message}`,
          error: error.name,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
     }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os contratos' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de contratos retornada com sucesso',
    type: [ContratoResponseDto]
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Token não fornecido ou inválido' 
  })
  async findAll() {
     try {
      const contratos = await this.listContratosUseCase.execute();
      logger.info(`Listagem de contratos realizada com sucesso. Total: ${contratos.length}`);
      return contratos.map(contrato => this.toContratoResponseDto(contrato));
     } catch (error) {
        logger.error(`Erro ao listar contratos: ${error.message}`, { context: 'ContratoController', stack: error.stack });
        throw new HttpException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Erro ao listar contratos: ${error.message}`,
          error: error.name,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
     }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um contrato pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Contrato encontrado com sucesso',
    type: ContratoResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Contrato não encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Token não fornecido ou inválido' 
  })
  async findOne(@Param('id') id: string) {
    try {
      const contrato = await this.getContratoUseCase.execute(id);
      if (!contrato) {
        throw new HttpException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Contrato não encontrado',
        }, HttpStatus.NOT_FOUND);
      }
      logger.info(`Contrato encontrado com sucesso: ${JSON.stringify(contrato)}`);
      return this.toContratoResponseDto(contrato);
    } catch (error) {
       logger.error(`Erro ao buscar contrato por ID ${id}: ${error.message}`, { context: 'ContratoController', stack: error.stack });
        // Aqui você pode adicionar lógica para tratar erros específicos dos use-cases,
        // como NotFoundException
        throw new HttpException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Erro ao buscar contrato: ${error.message}`,
          error: error.name,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um contrato' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Contrato atualizado com sucesso',
    type: ContratoResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Contrato não encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos fornecidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Já existe um contrato para este orçamento' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Token não fornecido ou inválido' 
  })
  async update(
    @Param('id') id: string,
    @Body() updateContratoDto: UpdateContratoDto,
  ) {
    try {
      // Assumindo que o use-case de update retorna o contrato atualizado
      const updatedContrato = await this.updateContratoUseCase.execute(id, updateContratoDto);
      logger.info(`Contrato atualizado com sucesso: ${JSON.stringify(updatedContrato)}`);
      return this.toContratoResponseDto(updatedContrato);
    } catch (error) {
       logger.error(`Erro ao atualizar contrato com ID ${id}: ${error.message}`, { context: 'ContratoController', stack: error.stack });
       // Aqui você pode adicionar lógica para tratar erros específicos dos use-cases
        throw new HttpException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Erro ao atualizar contrato: ${error.message}`,
          error: error.name,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um contrato' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Contrato removido com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Contrato não encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Token não fornecido ou inválido' 
  })
  async remove(@Param('id') id: string) {
     try {
      await this.deleteContratoUseCase.execute(id);
      logger.info(`Contrato removido com sucesso: ID ${id}`);
      return { 
        statusCode: HttpStatus.OK,
        message: 'Contrato removido com sucesso' 
      };
     } catch (error) {
       logger.error(`Erro ao remover contrato com ID ${id}: ${error.message}`, { context: 'ContratoController', stack: error.stack });
        // Aqui você pode adicionar lógica para tratar erros específicos dos use-cases,
        // como NotFoundException
        throw new HttpException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Erro ao remover contrato: ${error.message}`,
          error: error.name,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
     }
  }

   private toContratoResponseDto(contrato: ContratoModel): ContratoResponseDto {
    return {
      id_contrato: contrato.id_contrato,
      id_cliente: (contrato as any).id_cliente,
      valor_contrato: contrato.valor_contrato,
      cod_orcamento: contrato.cod_orcamento,
      status_contrato: contrato.status_contrato as StatusContrato,
      data_inicio: contrato.data_inicio,
      data_entrega: contrato.data_entrega,
      cliente: (contrato as any).cliente,
      orcamento: (contrato as any).orcamento
    };
  }
} 