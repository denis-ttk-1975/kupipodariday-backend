import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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

  create(user: CreateUserDto): Promise<User> {
    // добавить bcrypt хеширование
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    console.log('id = ', id);
    return this.userRepository.findOneBy({ id });
  }

  findOneByQuery(query: any) {
    console.log('query222=', query);
    return this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async update(id: number, userNewData: UpdateUserDto): Promise<any> {
    await this.userRepository.update(id, userNewData);
    return this.userRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
