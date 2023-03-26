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
    // console.log('selectedWishes: ', selectedWishes);
    const newWishlist = await this.wishlistRepository.create({
      ...wishlist,
      owner: user,
      items: selectedWishes,
    });
    // console.log('newWishlist: ', newWishlist);

    return this.wishlistRepository.save(newWishlist);
  }

  findAll() {
    return this.wishlistRepository.find({
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.wishlistRepository.find({
      where: { id },
      relations: {
        items: true,
        owner: true,
      },
    });
    // console.log('user: ', user);
    return user;
  }

  async update(id: number, wishlistNewData: UpdateWishlistDto): Promise<any> {
    if (Object.keys(wishlistNewData).includes('items')) {
      console.log(1);
      const selectedWishes = await this.wishesService.findFromIdArray({
        where: { id: In(wishlistNewData.items) },
      });
      // console.log('selectedWishes: ', selectedWishes);
      await this.wishlistRepository.update(id, {
        ...wishlistNewData,
        items: selectedWishes,
      });
      console.log(3);
    } else {
      console.log(2);
      const editedWishlist = await this.wishlistRepository.find({
        where: { id },
        relations: {
          items: true,
          owner: true,
        },
      });
      // console.log('editedWishlist: ', editedWishlist);
      const selectedWishes = editedWishlist[0].items;
      console.log('selectedWishes: ', selectedWishes);
      console.log(4);
      console.log({
        ...wishlistNewData,
        items: [...selectedWishes],
      });
      console.log(5);
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
    // console.log('deletedWishList: ', deletedWishList);
    await this.wishlistRepository.delete({ id });
    return deletedWishList;
  }
}
