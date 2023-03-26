import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinTable,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import {
  Contains,
  IsInt,
  Length,
  IsUrl,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from 'class-validator';

import { Offer } from './../../offers/entities/offer.entity';
import { Wish } from './../../wishes/entities/wish.entity';
//import { Wishlist } from './../../wishlists/entities/wishlist.entity';
import { User } from './../../users/entities/user.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 250,
  })
  @Length(1, 250)
  name: string;

  @Column({
    type: 'varchar',
    length: 1500,
  })
  @Length(1, 1500)
  description: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
