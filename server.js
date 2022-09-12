
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
/*
 *  .env 記載のプロパティ読込
 */
require("dotenv").config();
const PORT = 5000;

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const posthRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");

/*
 *  データベースにアクセス
 */
mongoose
  .connect(process.env.MONGOURL)
  .then((res) => {
    console.log("・・・接続OK");
  })
  .catch((e) => {
    console.log("・・・接続NG");
  });

/*
 * json を使用する設定
 */
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));//.envにある
/*
 * /api/users を基準にルーティングを作成できる
 */
app.use("/api/users", userRoute);
/*
 * /api/auth を基準にルーティングを作成できる
 */
app.use("/api/auth", authRoute);
/*
 * /api/auth を基準にルーティングを作成できる
 */
app.use("/api/post", posthRoute);

app.use("/api/upload", uploadRoute);

app.listen(PORT, () => {
  console.log("listen");
});
