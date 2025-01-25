import { Router } from "express";
import {
    registerUser,
    loginUser,
    updateUser,
    filterUser,
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/update').patch(verifyJWT,updateUser)
router.route('/filter').get(verifyJWT,filterUser)


export default router;