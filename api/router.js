const router = require("express").Router();
const {
  getProfile,
  updatePassion,
  postNewRoadmap,
  updateRoadmap,
  postRoadmapCheckpoints,
  getRoadmapCheckpoints,
  getSuggestions,
  getFeed,
  updateSubmission
} = require("../api/controller/controller.js");

router.get("/getProfile", getProfile);
router.patch("/updatePassion", updatePassion);
router.post("/postNewRoadmap", postNewRoadmap);
router.patch("/updateRoadmap", updateRoadmap);
router.post("/postRoadmapCheckpoints", postRoadmapCheckpoints);
router.get("/getRoadmapCheckpoints", getRoadmapCheckpoints);
router.get("/getSuggestions", getSuggestions);
router.get("/getFeed", getFeed);
router.patch("/updateSubmission", updateSubmission);


module.exports = router;