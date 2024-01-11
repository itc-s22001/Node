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
  const email = req.query.email;

  const users = await prisma.user.findMany({
    where: {
      OR: [{name: {contains: name}}, {email: {contains: email}}]
    }
  });
  const data = {
    title: "Users/Find",
    content: users
  };
  res.render("users/index", data)
});

router.get("/add", (req, res, next) => {
  const data = {
    title: "Users/Add",
  };
  res.render("users/add", data);
});

router.post("/add", async (req, res, next) => {
  await prisma.user.create({
    data: {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      age: +req.body.age
    }
  });
  res.redirect("/users")
});

router.get("/edit/:id", async (req, res, next) => {
  const id = +req.params.id
  const user = await prisma.user.findUnique({where: {id}});
  const data = {
    title: "User/Edit",
    user
  };
  res.render("users/edit", data)
});

router.post("/edit", async (req, res, next) => {
  const {id, name, password, email, age} = req.body;
  await prisma.user.update({
    where: {id: +id},
    data: {name, email, password, age: +age}
  });
  res.redirect("/users")
})


module.exports = router;


