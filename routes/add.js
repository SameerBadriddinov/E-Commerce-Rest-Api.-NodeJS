const { Router } = require("express");
const {validationResult} = require("express-validator/check")
const Notebook = require("../models/notebook");
const auth = require("../middleware/auth");
const {notebookValidators} = require("../utils/validators")
const router = Router();

router.get("/", auth, (req, res) => {
  res.render("add", { title: "Add Notebook", isAdd: true });
});

router.post("/", auth, notebookValidators, async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(422).render("add", {
      title: "Add Notebook",
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        descr: req.body.descr
      }
    });
  }
  const notebook = new Notebook({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    descr: req.body.descr,
    userId: req.user,
  });
  try {
    await notebook.save();
    res.redirect("/notebooks");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
