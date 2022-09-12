// auth に関するルータ設定を分けて記述する。
const router = require("express").Router();
const User = require("./../models/User");

router.get("/", (req, res) => {
  res.send("auth router");
});

/*
 * ユーザ登録　/api/ath/register
 */
router.post("/register", async (req, res) => {
  try {
    /*
     * リクエストで受け取ったパラメータをセット
     */
    const newUser = await new User({
      userName: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const user = await newUser.save();

    /*
     * 成功を返却する
     */
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

/*
 * ログイン　/api/ath/login
 */
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).send("ユーザが見つかりません");
    }
    const validatePass = user.password === req.body.password;
    
    if (!validatePass) {
        return res.status(404).send("パスワードが間違っています");
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// server.js で呼び出す
module.exports = router;
