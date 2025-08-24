import { elasticClient } from "../elastic/elasticClient";
import { IOrder } from "../interfaces/IOrder";
import { rabbitMQService } from "@eloritzkovitz/server-essentials";

export async function listenForOrderEvents() {
  const channel = (rabbitMQService as any).channel;
  if (!channel) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  await channel.assertQueue("order_events", { durable: true });
  channel.consume("order_events", async (msg: any) => {
    if (msg) {
      const event = JSON.parse(msg.content.toString());
      if (["ORDER_CREATED", "ORDER_UPDATED"].includes(event.type)) {
        await elasticClient.index({
          index: "orders",
          id: event.data.id,
          document: event.data as IOrder,
        });
      } else if (event.type === "ORDER_DELETED") {
        await elasticClient.delete({
          index: "orders",
          id: event.data.id,
        });
      }
      channel.ack(msg);
    }
  });
}