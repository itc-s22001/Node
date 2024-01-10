const router =  require("express").Router();
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

/* GET users listing. */
router.get("/", async (req, res, next) => {
  const users = await prisma.user.findMany();
  const data = {
    title: "Users/Index",
    content: users
  };
  res.render("users/index", data);
});

module.exports = router;


