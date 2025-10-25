import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllGames = query({
  args: {},
  handler: async (ctx) => {
    const games = await ctx.db
      .query("games")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    return games;
  },
});

export const getGamesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const games = await ctx.db
      .query("games")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    return games;
  },
});

export const getGameProducts = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    return products;
  },
});

export const getPopularProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_popular", (q) => q.eq("isPopular", true))
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(6);
    
    const productsWithGames = await Promise.all(
      products.map(async (product) => {
        const game = await ctx.db.get(product.gameId);
        return { ...product, game };
      })
    );
    
    return productsWithGames;
  },
});

// إضافة بيانات تجريبية للألعاب
export const seedGames = mutation({
  args: {},
  handler: async (ctx) => {
    // التحقق من وجود بيانات مسبقاً
    const existingGames = await ctx.db.query("games").take(1);
    if (existingGames.length > 0) {
      return "البيانات موجودة مسبقاً";
    }

    const games = [
      {
        name: "PUBG Mobile",
        nameAr: "ببجي موبايل",
        description: "Battle Royale Mobile Game",
        descriptionAr: "لعبة باتل رويال للجوال",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
        category: "mobile",
        isActive: true,
      },
      {
        name: "Free Fire",
        nameAr: "فري فاير",
        description: "Battle Royale Mobile Game",
        descriptionAr: "لعبة باتل رويال للجوال",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
        category: "mobile",
        isActive: true,
      },
      {
        name: "Fortnite",
        nameAr: "فورتنايت",
        description: "Battle Royale Game",
        descriptionAr: "لعبة باتل رويال",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400",
        category: "pc",
        isActive: true,
      },
      {
        name: "Valorant",
        nameAr: "فالورانت",
        description: "Tactical FPS Game",
        descriptionAr: "لعبة إطلاق نار تكتيكية",
        image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400",
        category: "pc",
        isActive: true,
      },
      {
        name: "FIFA 24",
        nameAr: "فيفا 24",
        description: "Football Simulation Game",
        descriptionAr: "لعبة محاكاة كرة القدم",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
        category: "console",
        isActive: true,
      },
      {
        name: "Call of Duty",
        nameAr: "كول أوف ديوتي",
        description: "First Person Shooter",
        descriptionAr: "لعبة إطلاق نار من منظور الشخص الأول",
        image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400",
        category: "console",
        isActive: true,
      },
    ];

    const gameIds = [];
    for (const game of games) {
      const gameId = await ctx.db.insert("games", game);
      gameIds.push(gameId);
    }

    // إضافة منتجات الشحن
    const products = [
      // PUBG Mobile
      { gameIndex: 0, name: "60 UC", nameAr: "60 يو سي", price: 5, deliveryTime: "5 minutes", deliveryTimeAr: "5 دقائق", isPopular: false },
      { gameIndex: 0, name: "325 UC", nameAr: "325 يو سي", price: 25, deliveryTime: "5 minutes", deliveryTimeAr: "5 دقائق", isPopular: true },
      { gameIndex: 0, name: "660 UC", nameAr: "660 يو سي", price: 50, deliveryTime: "5 minutes", deliveryTimeAr: "5 دقائق", isPopular: true },
      { gameIndex: 0, name: "1800 UC", nameAr: "1800 يو سي", price: 125, deliveryTime: "5 minutes", deliveryTimeAr: "5 دقائق", isPopular: false },
      
      // Free Fire
      { gameIndex: 1, name: "100 Diamonds", nameAr: "100 ماسة", price: 8, deliveryTime: "5 minutes", deliveryTimeAr: "5 دقائق", isPopular: false },
      { gameIndex: 1, name: "310 Diamonds", nameAr: "310 ماسة", price: 22, deliveryTime: "5 minutes", deliveryTimeAr: "5 دقائق", isPopular: true },
      { gameIndex: 1, name: "520 Diamonds", nameAr: "520 ماسة", price: 35, deliveryTime: "5 minutes", deliveryTimeAr: "5 دقائق", isPopular: true },
      { gameIndex: 1, name: "1080 Diamonds", nameAr: "1080 ماسة", price: 70, deliveryTime: "5 minutes", deliveryTimeAr: "5 دقائق", isPopular: false },
      
      // Fortnite
      { gameIndex: 2, name: "1000 V-Bucks", nameAr: "1000 في-باكس", price: 40, deliveryTime: "10 minutes", deliveryTimeAr: "10 دقائق", isPopular: true },
      { gameIndex: 2, name: "2800 V-Bucks", nameAr: "2800 في-باكس", price: 95, deliveryTime: "10 minutes", deliveryTimeAr: "10 دقائق", isPopular: false },
      
      // Valorant
      { gameIndex: 3, name: "1000 VP", nameAr: "1000 نقطة فالورانت", price: 45, deliveryTime: "15 minutes", deliveryTimeAr: "15 دقيقة", isPopular: true },
      { gameIndex: 3, name: "2400 VP", nameAr: "2400 نقطة فالورانت", price: 100, deliveryTime: "15 minutes", deliveryTimeAr: "15 دقيقة", isPopular: false },
      
      // FIFA 24
      { gameIndex: 4, name: "1000 FIFA Points", nameAr: "1000 نقطة فيفا", price: 50, deliveryTime: "20 minutes", deliveryTimeAr: "20 دقيقة", isPopular: true },
      { gameIndex: 4, name: "2200 FIFA Points", nameAr: "2200 نقطة فيفا", price: 100, deliveryTime: "20 minutes", deliveryTimeAr: "20 دقيقة", isPopular: false },
      
      // Call of Duty
      { gameIndex: 5, name: "1000 COD Points", nameAr: "1000 نقطة كود", price: 45, deliveryTime: "15 minutes", deliveryTimeAr: "15 دقيقة", isPopular: true },
      { gameIndex: 5, name: "2400 COD Points", nameAr: "2400 نقطة كود", price: 95, deliveryTime: "15 minutes", deliveryTimeAr: "15 دقيقة", isPopular: false },
    ];

    for (const product of products) {
      await ctx.db.insert("products", {
        gameId: gameIds[product.gameIndex],
        name: product.name,
        nameAr: product.nameAr,
        description: `${product.name} for ${games[product.gameIndex].name}`,
        descriptionAr: `${product.nameAr} للعبة ${games[product.gameIndex].nameAr}`,
        price: product.price,
        currency: "SAR",
        isPopular: product.isPopular,
        isActive: true,
        deliveryTime: product.deliveryTime,
        deliveryTimeAr: product.deliveryTimeAr,
      });
    }

    return "تم إضافة البيانات بنجاح";
  },
});
