import { Router } from "express"
import { getMe, postLogin, postSignup } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router= Router();

router.post('/signup',postSignup); 
router.post('/login', postLogin);

// a route to get user details
router.get('/me', requireAuth, getMe);
 
export default router 