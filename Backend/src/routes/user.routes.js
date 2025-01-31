import { Router } from "express";
import {
    registerUser,
    loginUser,
    updateUser,
    filterUser,
    getCurrentUser,
    logoutUser
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/update').patch(verifyJWT,updateUser)
router.route('/filter').get(verifyJWT,filterUser)
router.route('/getuser').get(verifyJWT,getCurrentUser)
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/checkuser').get(verifyJWT)

export default router;