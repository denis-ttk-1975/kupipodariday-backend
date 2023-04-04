import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

import { Offer } from './entities/offer.entity';
import { User } from './../users/entities/user.entity';

import { WishesService } from './../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(offer: CreateOfferDto, user: User) {
    const wish = await this.wishesService.findOne(offer.itemId);

    if (wish.owner.id === user.id) {
      throw new ForbiddenException(
        'Вы не можете вносить деньги на собственные подарки',
      );
    }

    if (wish.raised === wish.price) {
      throw new BadRequestException('Нужная сумма уже собрана');
    }

    if (wish.raised + offer.amount > wish.price) {
      throw new BadRequestException(
        `Сумма заявки превысит необходимую сумму. Можно заявить не более ${
          wish.price - wish.raised
        }`,
      );
    }

    // не знаю правильно ли я понял как сделать транзакцию для двух репозиториев

    await this.offerRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const newRaisedAmount = wish.raised + offer.amount;

        await this.wishesService.update(
          wish.id,
          { raised: newRaisedAmount },
          user,
        );

        const newOffer = await this.offerRepository.create({
          user,
          ...offer,
          item: wish,
        });

        await transactionalEntityManager.save(newOffer);
      },
    );

    // const newRaisedAmount = wish.raised + offer.amount;

    // await this.wishesService.update(wish.id, { raised: newRaisedAmount }, user);

    // const newOffer = await this.offerRepository.create({
    //   user,
    //   ...offer,
    //   item: wish,
    // });

    // await this.offerRepository.save(newOffer);

    return {};
  }

  findAll() {
    return this.offerRepository.find({
      relations: {
        item: true,
        user: true,
      },
    });
  }

  findOne(id: number) {
    return this.offerRepository.findOne({
      where: { id },
      relations: {
        item: true,
        user: true,
      },
    });
  }

  update(id: number, offerNewData: UpdateOfferDto) {
    return this.offerRepository.update(id, offerNewData);
  }

  remove(id: number) {
    return this.offerRepository.delete({ id });
  }
}
