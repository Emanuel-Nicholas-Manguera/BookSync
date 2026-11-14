require("dotenv").config({ path: require("node:path").join(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopAutocompleteRouter = require("./routes/shop/autocomplete-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");
const genreStatsRouter = require("./routes/common/genre-stats-routes");
const categoryStatsRouter = require("./routes/common/category-stats-routes");
const lowStockRouter = require("./routes/common/low-stock-routes");
const topProductsRouter = require("./routes/common/top-products-routes");

const brandRoutes = require("./routes/shop/brand-routes");
const genreRoutes = require("./routes/shop/genre-routes");
const categoryRoutes = require("./routes/shop/category-routes");

const { authMiddleware } = require("./controllers/auth/auth-controller");
const { MONGODB_URI, MONGODB_MANAGE_SCHEMA } = process.env;
const app = express();
const PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || "127.0.0.1";

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Administrator access is required." });
  }
  return next();
}

app.use("/api/admin", authMiddleware, requireAdmin);
app.use(["/api/common/feature", "/api/brands", "/api/genres", "/api/categories"], (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }
  return authMiddleware(req, res, () => requireAdmin(req, res, next));
});

app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/autocomplete", shopAutocompleteRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/common/genre-stats", genreStatsRouter);
app.use("/api/common/category-stats", categoryStatsRouter);
app.use("/api/common/low-stock-products", lowStockRouter);
app.use("/api/common/top-products", topProductsRouter);

app.use("/api/brands", brandRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/categories", categoryRoutes);

async function start() {
  if (!MONGODB_URI) {
    throw new Error("Set MONGODB_URI in server/.env or the server environment.");
  }

  const manageSchema = MONGODB_MANAGE_SCHEMA === "true";
  await mongoose.connect(MONGODB_URI, {
    autoCreate: manageSchema,
    autoIndex: manageSchema,
    serverSelectionTimeoutMS: 8000,
  });
  console.log("MongoDB connected");

  app.listen(PORT, HOST, () => console.log(`Server is now running on ${HOST}:${PORT}`));
}

start().catch((error) => {
  console.error(`BookSync could not start (${error.name}). Check the MongoDB configuration and network access.`);
  process.exitCode = 1;
});
