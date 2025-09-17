import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IOrder } from "@shared/interfaces/IOrder.js";

@Entity()
export class Order implements IOrder {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  orderId!: string;

  @Column()
  customerId!: string;

  @Column()
  productId!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  date!: Date;
}