import { Router } from "express";
import { changeStatus, getStatus, getUserStatus } from "../controllers/status.controller.js";
const router= Router();

router.post('/changeStatus', changeStatus);
router.get('/getStatus',getStatus);
router.get('/getUserStatus',getUserStatus);
// router.delete('/deleteStaus')

export default router;