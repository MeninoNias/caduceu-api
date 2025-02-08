import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MailService } from '../mail-sender/mail-sender.service';
import { User } from '../users/entities/user.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { FindClientsDto } from './dto/find-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
    private mailService: MailService,
  ) { }


  async create(createClientDto: CreateClientDto) {
    const { email, password, ...clientData } = createClientDto;
    const existingUser = await this.userRepository.findOne({
      where: { email }
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.save(User, {
        name: clientData.fullName,
        email,
        password,
      });

      const client = await manager.save(Client, {
        ...clientData,
        user
      });

      await this.mailService.sendVerifyEmailMail(clientData.fullName, email, user.id);

      return client;
    });

  }

  async findAll(query: FindClientsDto): Promise<Client[]> {
    const qb = this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user');

    if (query.search) {
      qb.where('LOWER(client.fullName) LIKE LOWER(:search)', {
        search: `%${query.search}%`
      })
        .orWhere('LOWER(user.email) LIKE LOWER(:search)', {
          search: `%${query.search}%`
        });
    }

    if (query.isActive !== undefined) {
      qb.andWhere('client.isActive = :isActive', {
        isActive: query.isActive
      });
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne(
      {
        where: { id },
        relations: ['user']
      }
    );
    if (!client) throw new NotFoundException('Cliente não encontrado');
    return client;
  }

  async findOneByUser(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne(
      {
        where: { user: {id} },
        relations: ['user']
      }
    );
    if (!client) throw new NotFoundException('Cliente não encontrado');
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.findOneBy({ id });
    if (!client) throw new NotFoundException('Cliente não encontrado');
    await this.clientRepository.update(id, updateClientDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const client = await this.clientRepository.findOneBy({ id });
    if (!client) throw new NotFoundException('Cliente não encontrado');
    return await this.clientRepository.delete(id);
  }

}
