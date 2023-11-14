const express = require("express");
const router = express.Router();

const Products = require("../mongodb/products.models.js");
const IdCounter = require("../mongodb/idCounter.schemas.js");

//인증 미들웨어
const authMiddleware = require("../middlewares/auth-middleware.js");

//모든 상품 조회
router.get("/products", async (req, res) => {
  const products = await Products.find({});
  res.send(products);
});
// 상품 상세 조회
router.get("/products/:productId", (req, res) => {});

// 상품 생성 (인증 미들웨어 사용)
router.post("/product", authMiddleware, async (req, res) => {
  const { Product_name, Product_desc } = req.body;
  const { email } = res.locals.user;

  const product = Products.findOne({ Product_name });

  if (product.length) {
    return res.status(400).send({ errorMessage: "상품이 이미 존재합니다." });
  }

  const idCounter = await IdCounter.findOne({ model: "products" });
  if (!idCounter) {
    // 처음 등록할 경우 counter 생성
    await IdCounter.create({ model: "products", count: 1 });
  } else {
    // 이미 있다면 counter 증가
    idCounter.count++;
    await idCounter.save();
  }
  const productsId = idCounter.count;

  const createProduct = await Products.create({
    Product_id: productsId,
    Product_name: Product_name,
    Product_desc: Product_desc,
    User_name: email,
  });

  res.json({ products: createProduct, Message: "save Success" });
});

router.delete("/product/:productId", async (req, res) => {
  const { productId } = req.params;

  const product = await Products.findOne({ Product_id: productId });
});

//상품 수정 (인증 미들웨어 사용)
module.exports = router;
