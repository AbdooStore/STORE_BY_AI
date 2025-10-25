import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  games: defineTable({
    name: v.string(),
    nameAr: v.string(),
    description: v.string(),
    descriptionAr: v.string(),
    image: v.string(),
    category: v.string(),
    isActive: v.boolean(),
  }).index("by_category", ["category"]),

  products: defineTable({
    gameId: v.id("games"),
    name: v.string(),
    nameAr: v.string(),
    description: v.string(),
    descriptionAr: v.string(),
    price: v.number(),
    currency: v.string(),
    originalPrice: v.optional(v.number()),
    isPopular: v.boolean(),
    isActive: v.boolean(),
    deliveryTime: v.string(),
    deliveryTimeAr: v.string(),
  }).index("by_game", ["gameId"])
    .index("by_popular", ["isPopular"]),

  orders: defineTable({
    productId: v.id("products"),
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.optional(v.string()),
    gameUsername: v.string(),
    gameId: v.optional(v.string()),
    additionalInfo: v.optional(v.string()),
    status: v.string(),
    totalPrice: v.number(),
    currency: v.string(),
  }).index("by_status", ["status"])
    .index("by_phone", ["customerPhone"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
