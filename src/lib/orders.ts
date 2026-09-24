import { prisma } from "@/lib/prisma";
import { generateOrderReference } from "@/lib/format";

export const DELIVERY_FEE_DAKAR_CFA = 2000;
export const DELIVERY_FEE_AUTRE_CFA = 3500;

export type CheckoutItemInput = {
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

export type CheckoutCustomerInput = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
};

export async function createPendingOrder(
  customer: CheckoutCustomerInput,
  items: CheckoutItemInput[]
) {
  if (items.length === 0) {
    throw new Error("Le panier est vide");
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, isActive: true },
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  let subtotalCfa = 0;
  const orderItemsData = items.map((item) => {
    const product = productById.get(item.productId);
    if (!product) {
      throw new Error(`Produit introuvable : ${item.productId}`);
    }
    subtotalCfa += product.priceCfa * item.quantity;
    return {
      productId: product.id,
      productName: product.name,
      size: item.size,
      color: item.color,
      unitPriceCfa: product.priceCfa,
      quantity: item.quantity,
    };
  });

  const isDakar = customer.city.trim().toLowerCase().includes("dakar");
  const deliveryFeeCfa = isDakar ? DELIVERY_FEE_DAKAR_CFA : DELIVERY_FEE_AUTRE_CFA;
  const totalCfa = subtotalCfa + deliveryFeeCfa;

  const order = await prisma.order.create({
    data: {
      reference: generateOrderReference(),
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email || null,
      deliveryAddress: customer.address,
      deliveryCity: customer.city,
      subtotalCfa,
      deliveryFeeCfa,
      totalCfa,
      items: { create: orderItemsData },
    },
    include: { items: true },
  });

  return order;
}
