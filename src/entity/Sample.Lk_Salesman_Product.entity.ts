import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Sample.Lk_Salesman_Product' })
export class Lk_Salesman_Product {
  @PrimaryGeneratedColumn({ name: 'Salesrep' })
  salesrep: number;

  @Column({ name: 'Product' })
  product: string;
}
