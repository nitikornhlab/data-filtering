import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sales {
  @PrimaryGeneratedColumn({ name: 'OrderId' })
  orderId: number;

  @Column({ name: 'Product' })
  product: string;

  @Column({ name: 'Qty' })
  qty: number;
}
