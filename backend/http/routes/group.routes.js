import { Router } from "express";
import { addGroup, createGroup, getGroup, getInfo, getMessages } from "../controllers/group.controller.js";

const router= Router();

router.post('/create',createGroup);
router.post('/add', addGroup)
router.get('/allGroups',getGroup)
router.get('/messages',getMessages)
router.get('/info', getInfo)

export default router;