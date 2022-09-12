// user に関するルータ設定を分けて記述する。
const router = require("express").Router();
const User = require("./../models/User");

// 更新
router.put("/:id", async (req, res) => {
  // リンクのパラメータと form の ユーザID が一致した時に更新
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      // $set : req.body はスキーマの中身を全部を設定している
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を更新できます");
  }
});

// 削除
router.delete("/:id", async (req, res) => {
  // リンクのパラメータと form の ユーザID が一致した時に更新
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      // $set : req.body はスキーマの中身を全部を設定している
      const user = await User.findByIdAndDelete(req.params.id);

      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を更新できます");
  }
});

// 取得
/*
router.get("/:id", async (req, res) => {
  try {
    // $set : req.body はスキーマの中身を全部を設定している
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
});
*/
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ userName: username });
    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// フォロー
router.put("/:id/follow", async (req, res) => {
  /*
   * req.body.userId 自分自身のID
   * req.params.id   フォロー相手のID
   */
  if (req.body.userId !== req.params.id) {
    try {
      // フォローするユーザを検索(フォロー先)
      const user = await User.findById(req.params.id);
      // 現在のユーザを検索(フォロー元)
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        res.status(200).json("完了しました");
      } else {
        res.status(403).json("すでにフォロー済みです");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("自分自身をフォローできません");
  }
});

// フォロー解除
router.put("/:id/unfollow", async (req, res) => {
  /*
   * req.body.userId 自分自身のID
   * req.params.id   フォロー相手のID
   */
  if (req.body.userId !== req.params.id) {
    try {
      // フォローするユーザを検索(フォロー先)
      const user = await User.findById(req.params.id);
      // 現在のユーザを検索(フォロー元)
      const currentUser = await User.findById(req.body.userId);
      // ユーザIDが有れば解除
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });
        res.status(200).json("フォロー解除しました");
      } else {
        res.status(403).json("フォロー解除できません");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("自分自身をフォロー解除できません");
  }
});

// server.js で呼び出す
module.exports = router;
