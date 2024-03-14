const globalInfoController = require("../controllers/globalInfoController.js");

const router = require("express").Router();

router.post("/addGlobalInfo", globalInfoController.addGlobalInfo);

router.get("/allGlobalInfo", globalInfoController.getAllGlobalInfo);

router.get("/:id", globalInfoController.getGlobalInfo);

router.put("/:id", globalInfoController.updateGlobalInfo);

router.delete("/:id", globalInfoController.deleteGlobalInfo);

router.get("/searchByName", globalInfoController.searchByName);

router.get("/searchByNumber", globalInfoController.searchByNumber);

router.put("/markSpam", globalInfoController.markSpam);

router.put("/UnMarkSpam", globalInfoController.unMarkSpam);

module.exports = router;
