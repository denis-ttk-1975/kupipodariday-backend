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
    return this.userRepository.findOneBy({ id });
  }

  findOneByQuery({ query }: FindQueryUsersDto) {
    return this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  update(id: number, userNewData: UpdateUserDto): Promise<any> {
    return this.userRepository.update(id, userNewData);
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
