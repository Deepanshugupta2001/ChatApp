import { Router } from "express";
import { addStory, delStory, getStory, getUserStory } from "../controllers/story.controller.js";
import upload from "../middlewares/multer.js";
const router= Router();

router.post('/addStory', upload.single("file"), addStory);
router.get('/allStory', getStory);
router.get('/allUserStory', getUserStory);
router.delete('/delete',delStory);

export default router; 