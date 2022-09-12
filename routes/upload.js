// auth に関するルータ設定を分けて記述する。
const router = require("express").Router();
const multer = require("multer");// 画像をアップロードするライブラリ

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
})

const upload = multer({ storage });
// 画像投稿API
router.post("/", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("画像のアップロードに成功しました。");
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;