import { Injectable } from '@nestjs/common';
import { Repository, Any } from 'typeorm';
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
      where: { id: Any(wishlist.items) },
    });

    const newWishlist = await this.wishlistRepository.create({
      owner: user,
      items: selectedWishes,
      ...wishlist,
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
    await this.wishlistRepository.update(id, wishlistNewData);
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
