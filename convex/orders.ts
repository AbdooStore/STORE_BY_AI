import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrder = mutation({
  args: {
    productId: v.id("products"),
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.optional(v.string()),
    gameUsername: v.string(),
    gameId: v.optional(v.string()),
    additionalInfo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("المنتج غير موجود");
    }

    const orderId = await ctx.db.insert("orders", {
      ...args,
      status: "pending",
      totalPrice: product.price,
      currency: product.currency,
    });

    return orderId;
  },
});

export const getOrdersByPhone = query({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_phone", (q) => q.eq("customerPhone", args.phone))
      .order("desc")
      .collect();

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const product = await ctx.db.get(order.productId);
        const game = product ? await ctx.db.get(product.gameId) : null;
        return { ...order, product, game };
      })
    );

    return ordersWithDetails;
  },
});
