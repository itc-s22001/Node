const router =  require("express").Router();
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const pageSize = 3; //ユーザー一覧での１画面あたりに表示するレコード数

/* GET users listing. */
router.get("/", async (req, res, next) => {
  // 無条件で全データを表示したい場合
  const page = req.query.page ? +req.query.page : 0;
  const users = await prisma.user.findMany({
    orderBy: [{name: "asc"}],
    skip: pageSize * (page - 1),
    take: pageSize
  });
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
});

router.get("/delete/:id", async (req, res, next) => {
  const id = +req.params.id;
  const user = await prisma.user.findUnique({where: {id}});
  const data = {
    title: "Users/Delete",
    user
  };
  res.render("users/delete", data);
});

router.post("/delete", async (req, res, next) => {
  await prisma.user.delete({
    where: {id: +req.body.id}
  });
  res.redirect("/users")
});


module.exports = router;


