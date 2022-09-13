import { Router } from "express";
import { githubOAuth, login, logout } from "./controller";
import { authWrapper } from "./middleware";

const router = Router();

router.get("/login", login);
router.get("/logout", logout);
router.get("/github/oauth", authWrapper(githubOAuth));

export default router;
