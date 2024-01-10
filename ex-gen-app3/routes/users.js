const router =  require("express").Router();
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

/* GET users listing. */
router.get("/", async (req, res, next) => {
  const id = +req.query.id;　// Number(req.query.id); parseInt(req.query.id); どれかを使う
  if (id) {
    // idが指定されていた場合
    const user = await prisma.user.findUnique({  // findUniqueは主キーかユニークのみ取れる
      where: {
        id: id
      }
    });
    const data = {
      title: "Users/Index",
      content: [user]
    };
    res.render("users/index", data)
    return;
  }

  const age = +req.query.age;
  if (age) {
    // 年齢(age)が条件として指定された場合
    const users = await prisma.user.findMany({
      where: {
        age: {
          lte: age
        }
      }
    });
    const data = {
      title: "Users/Index",
      content: users
    };
    res.render("users/index", data);
    return;
  }
  // 無条件で全データを表示したい場合
  const users = await prisma.user.findMany();
  const data = {
    title: "Users/Index",
    content: users
  };
  res.render("users/index", data);
});

router.get("/find", async (req, res, next) => {
  const name = req.query.name;
  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: name
      }
    }
  });
  const data = {
    title: "Users/Find",
    content: users
  };
  res.render("users/index", data);
});

module.exports = router;


