import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getBalance,transferBalance } from "../controllers/account.controller.js"; 
import Router from "express"

const router  = Router();

router.route('/balance').get(verifyJWT,getBalance);
router.route('/transfer').post(verifyJWT,transferBalance);


export default router;