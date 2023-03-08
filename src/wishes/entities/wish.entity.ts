import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  Contains,
  IsInt,
  Length,
  IsUrl,
  IsNumber,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from 'class-validator';

@Entity()
export class Wish {
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
  })
  @IsUrl()
  link: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  image: string;

  @Column({
    type: 'decimal',
    scale: 2,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column({
    type: 'decimal',
    scale: 2,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @Column()
  owner: string;

  @Column({
    type: 'varchar',
    length: 1024,
  })
  @Length(1, 1024)
  description: string;

  @Column()
  offers: Array<string>;

  @Column()
  @IsInt()
  copied: number;
}
