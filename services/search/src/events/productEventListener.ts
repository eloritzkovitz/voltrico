import { elasticClient } from "../elastic/elasticClient";
import { IProduct } from "@eloritzkovitz/voltrico-libs";
import { rabbitMQService } from "@eloritzkovitz/voltrico-libs";

export async function listenForProductEvents() {
  // Wait for the channel to be ready
  const channel = (rabbitMQService as any).channel;
  if (!channel) {
    // Wait for initialization if needed
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  // Ensure the queue exists
  await channel.assertQueue("product_events", { durable: true });
  channel.consume("product_events", async (msg: any) => {
    if (msg) {
      const event = JSON.parse(msg.content.toString());
      if (["PRODUCT_CREATED", "PRODUCT_UPDATED"].includes(event.type)) {
        await elasticClient.index({
          index: "products",
          id: event.data.id,
          document: event.data as IProduct,
        });
      } else if (event.type === "PRODUCT_DELETED") {
        await elasticClient.delete({
          index: "products",
          id: event.data.id,
        });
      }
      channel.ack(msg);
    }
  });
}