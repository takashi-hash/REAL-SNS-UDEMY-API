// post に関するルータ設定を分けて記述する。
const router = require("express").Router();
const { append } = require("express/lib/response");
const Post = require("./../models/Post");
const User = require("./../models/User");

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);

  try {
    const post = await newPost.save();

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// 投稿を編集
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (req.body.userId === post.userId) {
      await post.updateOne({ $set: req.body });
    } else {
      return res.status(403).json("他人の投稿を編集できません");
    }

    return res.status(200).json("投稿の編集に成功しました");
  } catch (err) {
    return res.status(500).json(err);
  }
});
// 投稿を削除
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (req.body.userId === post.userId) {
      await post.deleteOne();
    } else {
      return res.status(403).json("他人の投稿を編集できません");
    }

    return res.status(200).json("投稿の削除に成功しました");
  } catch (err) {
    return res.status(500).json(err);
  }
});
// 投稿を取得
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// いいね
router.put("/:id/like", async (req, res) => {
  /*
   * req.body.userId 自分自身のID
   * req.params.id   フォロー相手のID
   */
  try {
    const post = await Post.findById(req.params.id);
    // 「いいね」が未押下
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });

      res.status(200).json("投稿に「いいね」を押しました");
    } else {
      // 「いいね」が押下済
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      res.status(403).json("投稿の「いいね」を解除しました");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

/*
 * タイムラインの取得
 * /:id で宣言している為「/timelie」だと「/:id」に引っかかる
 */
router.get("/timeline/:userId", async (req, res) => {
  try {
    // リクエストのユーザ情報を取得
    const currentUser = await User.findById(req.params.userId);
    // 自分の投稿内容を取得する
    const post = await Post.find({ userId: currentUser._id });
    // 自分がフォローしているユーザを取得する
    const friendPost = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    return res.status(200).json(post.concat(...friendPost));
  } catch (error) {
    res.status(500).json(error);
  }
});
/*
 * プロフィール用のタイムライン取得
 * /:id で宣言している為「/timelie」だと「/:id」に引っかかる
 */
router.get("/profile/:username", async (req, res) => {
  try {
    // リクエストのユーザ情報を取得
    const user = await User.findOne({ userName: req.params.username });
    // 自分の投稿内容を取得する
    const posts = await Post.find({ userId: user._id });
    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});
/*
router.get('/', (req, res) => {
    res.send('post router');
});
*/

// server.js で呼び出す
module.exports = router;
