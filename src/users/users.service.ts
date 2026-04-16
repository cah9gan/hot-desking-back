import { randomUUID } from 'crypto';
import { BanUserDTO, CreateUserDTO, ViewUserDTO } from './dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { mapUserRoleToDb, UserViewMapper } from './mappers';
import { UserStatus } from '../../generated/prisma/enums';

@Injectable()
export class UsersService {
  private readonly mapper = new UserViewMapper();
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO): Promise<ViewUserDTO> {
    const user = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        role: mapUserRoleToDb(data.role),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        status: UserStatus.active,
        createdBy: randomUUID(),
      },
    });

    return this.mapper.mapOne(user);
  }

  async get(): Promise<ViewUserDTO[]> {
    const data = await this.prisma.user.findMany({});
    return this.mapper.mapMany(data);
  }

  async getOne(id: string): Promise<ViewUserDTO> {
    const data = await this.prisma.user.findFirst({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException('User not found');
    }
    return this.mapper.mapOne(data);
  }

  async update(id: string, data: CreateUserDTO): Promise<ViewUserDTO> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: mapUserRoleToDb(data.role),
      },
    });

    return this.mapper.mapOne(updatedUser);
  }

  async ban(id: string, data: BanUserDTO): Promise<ViewUserDTO> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        status: data.banned ? UserStatus.banned : UserStatus.active,
      },
    });

    return this.mapper.mapOne(updatedUser);
  }
}
