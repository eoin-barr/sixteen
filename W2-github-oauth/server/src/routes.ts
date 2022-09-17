import { Router } from 'express';
import { githubOAuth, login, logout, test } from './controller';
import { authWrapper } from './middleware';

const router = Router();

router.get('/test', test);
router.post('/login', login);
router.get('/logout', logout);
router.post('/github/oauth', authWrapper(githubOAuth));

export default router;
