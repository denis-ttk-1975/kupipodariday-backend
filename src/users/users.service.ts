import { Injectable, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindQueryUsersDto } from './dto/find-query-user.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const samePropsUserCheck = await this.userRepository.find({
      where: [{ email: user.email }, { username: user.username }],
    });

    if (samePropsUserCheck.length) {
      throw new ForbiddenException(
        'Пользователь с таким именем уже существует',
      );
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userWithHashedPassword = { ...user, password: hashedPassword };
    return this.userRepository.save(userWithHashedPassword);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    // console.log('id = ', id);
    return this.userRepository.findOneBy({ id });
  }

  findOneByQuery(query: string) {
    // console.log('query222=', query);
    return this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async update(id: number, userNewData: UpdateUserDto): Promise<any> {
    // console.log('userNewData: ', userNewData);
    const samePropsUserCheck = await this.userRepository.find({
      where: [{ email: userNewData.email }, { username: userNewData.username }],
    });

    if (samePropsUserCheck.length) {
      throw new ForbiddenException(
        'Пользователь с таким именем уже существует',
      );
    }

    await this.userRepository.update(id, userNewData);
    return this.userRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }

  async findOneByName(username: string) {
    return this.userRepository.find({
      where: [{ username: username }],
    });
  }
}
