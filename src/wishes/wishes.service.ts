import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  create(wish: CreateWishDto, user: User): Promise<Wish> {
    //return 'This action adds a new wish';
    return this.wishRepository.save({ ...wish, owner: user });
  }

  findAll() {
    return this.wishRepository.find();
  }

  findOne(id: number) {
    return this.wishRepository.findOneBy({ id });
  }

  update(id: number, wishNewData: UpdateWishDto): Promise<any> {
    return this.wishRepository.update(id, wishNewData);
  }

  remove(id: number) {
    return this.wishRepository.delete({ id });
  }
}
