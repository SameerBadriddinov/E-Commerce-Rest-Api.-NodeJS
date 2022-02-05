const { Router } = require("express");
const Notebook = require("../models/notebook");
const auth = require("../middleware/auth");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const notebooks = await Notebook.find()
      .populate("userId", "email name")
      .select("price title img descr");

    res.render("notebooks", {
      title: "Notebooks",
      isNotebooks: true,
      userId: req.user ? req.user._id.toString() : null,
      notebooks,
    });
  }catch(e) {
    console.log(e)
  }
});

router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  try{
    const notebook = await Notebook.findById(req.params.id);
    if(notebook.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/notebooks')
    }
    res.render("notebook-edit", {
      title: `Edit ${notebook.title}`,
      notebook,
    });
  }catch(e) {
    console.log(e)
  }
});

router.post("/edit", auth, async (req, res) => {
  await Notebook.findByIdAndUpdate(req.body.id, req.body);
  res.redirect("/notebooks");
});

router.post("/remove", auth, async (req, res) => {
  try {
    await Notebook.deleteOne({ _id: req.body.id });
    res.redirect("/notebooks");
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  const notebook = await Notebook.findById(req.params.id);
  res.render("notebook", {
    layout: "detail",
    title: `Notebook ${notebook.title}`,
    notebook,
  });
});

module.exports = router;
