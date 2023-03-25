import { Injectable } from '@nestjs/common';
import { Repository, Any, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

import { Wishlist } from './entities/wishlist.entity';
import { User } from './../users/entities/user.entity';

import { WishesService } from './../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(user: User, wishlist: CreateWishlistDto): Promise<Wishlist> {
    const selectedWishes = await this.wishesService.findFromIdArray({
      where: { id: In(wishlist.items) },
    });

    const newWishlist = await this.wishlistRepository.create({
      ...wishlist,
      owner: user,
      items: selectedWishes,
    });

    return this.wishlistRepository.save(newWishlist);
  }

  findAll() {
    return this.wishlistRepository.find();
  }

  findOne(id: number) {
    return this.wishlistRepository.find({
      where: { id },
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  async update(id: number, wishlistNewData: UpdateWishlistDto): Promise<any> {
    if (Object.keys(wishlistNewData).includes('items')) {
      const selectedWishes = await this.wishesService.findFromIdArray({
        where: { id: In(wishlistNewData.items) },
      });
      await this.wishlistRepository.update(id, {
        ...wishlistNewData,

        items: selectedWishes,
      });
    } else {
      const editedWishlist = await this.wishlistRepository.find({
        where: { id },
        relations: {
          items: true,
          owner: true,
        },
      });
      const selectedWishes = editedWishlist[0].items;
      await this.wishlistRepository.update(id, {
        ...wishlistNewData,
        items: selectedWishes,
      });
    }
    return this.wishlistRepository.find({
      where: { id },
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  async remove(id: number) {
    const deletedWishList = await this.wishlistRepository.find({
      where: { id },
      relations: {
        items: true,
        owner: true,
      },
    });
    await this.wishlistRepository.delete({ id });
    return deletedWishList;
  }
}
