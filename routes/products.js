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
router.get("/product/:productId", (req, res) => {});

// 상품 생성 (인증 미들웨어 사용)
router.post("/product", authMiddleware, async (req, res) => {
  const { Product_name, Product_desc } = req.body;
  const { email } = res.locals.user;

  const product = Products.findOne({ Product_name });
  let idCounter = await IdCounter.findOne({ model: "product9" });
  if (product.length) {
    res.status(400).send({ errorMessage: "상품이 이미 존재합니다." });
  }

  if (!idCounter) {
    // 처음 등록할 경우 counter 생성
    await IdCounter.create({ model: "product9", count: 1 });
    console.log("test");
  } else {
    // 이미 있다면 counter 증가
    idCounter.count++;
    await idCounter.save();
  }
  idCounter = await IdCounter.findOne({ model: "product9" });
  const productsId = idCounter.count;

  const createProduct = await Products.create({
    Product_id: productsId,
    Product_name: Product_name,
    Product_desc: Product_desc,
    User_name: email,
  });

  res.status(200).send({ products: createProduct, Message: "save Success" });

  //console.log(error);
});

router.delete("/product/:productId", authMiddleware, async (req, res) => {
  const { productId } = req.params;
  const { email } = res.locals.user;

  const product = await Products.findOne({ Product_id: productId });

  if (!product) {
    res.status(401).send({ errorMessage: "상품이 존재하는지 확인해주세요" });
    return;
  }

  if (product.User_name !== email) {
    res
      .status(401)
      .send({ errorMessage: "본인이 작성한 글만 삭제가 가능합니다." });
  }

  await Products.deleteOne({ Product_id: productId });
  res.status(200).send({ Message: "삭제 되었습니다." });
});

//상품 수정 (인증 미들웨어 사용)
router.put("/product/:productId", authMiddleware, async (req, res) => {
  const { productId } = req.params;
  const { Product_name, Product_desc, State } = req.body;

  //res.locals.user 값 가져오기
  const { email } = res.locals.user;

  const product = await Products.findOne({ Product_id: productId });

  if (!product) {
    res.status(401).send({ errorMessage: "상품이 존재하는지 확인해주세요." });
    return;
  }

  if (product.User_name !== email) {
    res
      .status(401)
      .send({ errorMessage: "본인이 작성한 글만 삭제가 가능합니다." });
  }

  await Products.updateOne(
    { Product_id: productId },
    {
      $set: {
        Product_name: Product_name,
        Product_desc: Product_desc,
        State: State,
      },
    }
  );

  const productResult = await Products.findOne({ Product_id: productId });

  res.status(200).send({ productResult });
});
module.exports = router;
