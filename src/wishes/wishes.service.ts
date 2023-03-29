import { Injectable, ForbiddenException } from '@nestjs/common';
import { Repository, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

import { Wish } from './entities/wish.entity';
import { User } from './../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(wish: CreateWishDto, user: User) {
    //return 'This action adds a new wish';
    await this.wishRepository.save({ ...wish, owner: user });
    return {};
  }

  findAll() {
    return this.wishRepository.find();
  }

  findOne(id: number) {
    return this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async update(id: number, wishNewData: UpdateWishDto, user: User) {
    const editedWish = await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
    if (
      user.id !== editedWish.owner.id &&
      !wishNewData.hasOwnProperty('raised')
    ) {
      throw new ForbiddenException('Вы не можете редактировать чужие подарки');
    }
    if (wishNewData.price && editedWish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }
    await this.wishRepository.update(id, wishNewData);
    return {};
  }

  async remove(id: number, user: User) {
    const deletingWish = await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
    if (user.id !== deletingWish.owner.id) {
      throw new ForbiddenException('Вы не можете удалять чужие подарки');
    }

    return this.wishRepository.delete({ id });
  }

  findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 1,
      order: { createdAt: 'DESC' },
      relations: {
        owner: true,
      },
    });
  }

  findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 1,
      order: { copied: 'DESC' },
      relations: {
        owner: true,
      },
    });
  }

  async copyWish(wish: Wish, user: User) {
    if (user.id === wish.owner.id) {
      throw new ForbiddenException('Вы не можете копировать свой подарок');
    }

    const arrayForSameWishes = await this.wishRepository.find({
      where: [{ name: wish.name }],
      relations: {
        owner: true,
      },
    });

    let hasUserCopied = false;

    arrayForSameWishes.forEach((item) => {
      if (+item.owner.id === +user.id) {
        hasUserCopied = true;
      }
    });

    if (hasUserCopied) {
      throw new ForbiddenException(
        'Вы уже создали у себя или скопировали себе такой же подарок',
      );
    }

    const dataWish = {
      name: wish.name,
      image: wish.image,
      link: wish.link,
      price: wish.price,
      description: wish.description,
    };
    const addCopiesNumber = wish.copied + 1;

    await this.wishRepository.update(wish.id, { copied: addCopiesNumber });
    return dataWish;
  }

  async findFromIdArray(item: FindManyOptions<Wish>) {
    return this.wishRepository.find(item);
  }

  async findWishesByUserId(id: number) {
    return this.wishRepository.find({
      where: { owner: { id: id } },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }
}
