import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor (private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    //coloquei como "data" para facilitar no processo de salvar no prisma
    const data = {
      ...CreateUserDto,
      //coloquei 'senha_hash" assim como estava no banco
      // o '10' é o numero de rounds que a criptogração do bcrypt utiliza
      senha_hash: await bcrypt.hash(createUserDto.password, 10),
    };

    const createdUser = await this.prisma.user.create({ data });

    return {
      ...createdUser,
      senha_hash: undefined,
    };
  }

  findByEmail(email: string) {

    return this.prisma.user.findUnique({
      where: { email }, 
    });
  }
/*
  findAll() {
    return `This action returns all user`;
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
*/
}
