import express from 'express';
import Router from 'express-promise-router';
import passport from 'passport';

export const router = Router();
router.get('/start', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent',
    state: '8745634875963',
  })(req, res, next);
});

router.get('/handler/frame', passport.authenticate('google'), function (
  req,
  res,
) {
  console.log('DEBUG: req.session.passport.user', req.session?.passport.user);
  console.log('DEBUG: req.params =', req.params);
  console.log('DEBUG: req.url =', req.url);
  res.send('yay!');
});

router.get('/logout', async (_req: express.Request, res: express.Response) => {
  res.send('google provider logout');
});

router.get(
  '/refreshToken',
  async (_req: express.Request, res: express.Response) => {
    res.send('google provider refreshToken');
  },
);
