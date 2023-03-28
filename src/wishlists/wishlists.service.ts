import { Injectable, ForbiddenException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
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
    console.log('selectedWishes - create: ', selectedWishes);
    const newWishlist = await this.wishlistRepository.create({
      ...wishlist,
      owner: user,
      items: selectedWishes,
    });
    /* Logging the newWishlist object to the console. */
    console.log('newWishlist: ', newWishlist);

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
    return user;
  }

  async update(
    id: number,
    wishlistNewData: UpdateWishlistDto,
    user: User,
  ): Promise<any> {
    const editedWishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: {
        items: true,
        owner: true,
      },
    });
    if (user.id !== editedWishlist.owner.id) {
      throw new ForbiddenException(
        'Вы не можете редактировать чужие списки подарков',
      );
    }

    let selectedWishes;

    if (Object.keys(wishlistNewData).includes('items')) {
      selectedWishes = await this.wishesService.findFromIdArray({
        where: { id: In(wishlistNewData.items) },
      });

      const { items, ...restWishListData } = wishlistNewData;
      Object.assign(editedWishlist, {
        ...restWishListData,
        items: selectedWishes,
      });
      await this.wishlistRepository.save(editedWishlist);
      // await this.wishlistRepository.update(id, {
      //   name: wishlistNewData.name ? wishlistNewData.name : editedWishlist.name,
      //   description: wishlistNewData.description
      //     ? wishlistNewData.description
      //     : editedWishlist.description,
      //   image: wishlistNewData.image
      //     ? wishlistNewData.image
      //     : editedWishlist.image,
      //   items: selectedWishes,
      // });
    } else {
      const editedWishlist = await this.wishlistRepository.findOne({
        where: { id },
        relations: {
          items: true,
          owner: true,
        },
      });

      await this.wishlistRepository.update(id, {
        name: wishlistNewData.name ? wishlistNewData.name : editedWishlist.name,
        description: wishlistNewData.description
          ? wishlistNewData.description
          : editedWishlist.description,
        image: wishlistNewData.image
          ? wishlistNewData.image
          : editedWishlist.image,
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

  async remove(id: number, user: User) {
    const deletedWishList = await this.wishlistRepository.findOne({
      where: { id },
      relations: {
        items: true,
        owner: true,
      },
    });
    if (user.id !== deletedWishList.owner.id) {
      throw new ForbiddenException(
        'Вы не можете редактировать чужие списки подарков',
      );
    }
    await this.wishlistRepository.delete({ id });
    return deletedWishList;
  }
}
