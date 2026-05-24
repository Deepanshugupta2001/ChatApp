import { Router } from "express";
import {  getFriendInfo, getFriends, getMessages } from "../controllers/user.controller.js";
const router= Router();

router.get('/friends', getFriends)
router.get('/messages',getMessages) 
router.get('/friendInfo', getFriendInfo)
     
export default router; 