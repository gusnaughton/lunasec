import bodyParser from 'body-parser';
import { Router } from 'express';

import { Models } from '../../common/models';

export function userRouter(models: Models) {
  const router = Router();

  router.use(bodyParser.json());

  /* GET users listing. */
  router.get('/me', async (_req, res) => {
    const user = await models.user.getUser('1'); // Just get the pre-created user from the db migration
    res.json({
      success: true,
      user,
    });
  });

  router.post('/set-ssn', async (req, res) => {
    try {
      // Note the lack of grant checking.  There are no grants in the simple-tokenizer.  If you have the token you can get the data, simple.
      await models.user.setSsn('1', req.body.ssn_token); // just set the ssn on our pre-created user from the db migration, this is a really simple demo
    } catch (e) {
      return res.json({
        success: false,
        error: e,
      });
    }

    return res.json({
      success: true,
    });
  });

  return router;
}