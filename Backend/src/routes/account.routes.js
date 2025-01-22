import { verifyJWT } from "../middlewares/auth.middleware";
import { getBalance,transferBalance } from "../controllers/account.controller"; 
import Router from "express"

const router  = Router();

router.route('/balance').get(verifyJWT,getBalance);
router.route('/transfer').patch(verifyJWT,transferBalance);


export default router;