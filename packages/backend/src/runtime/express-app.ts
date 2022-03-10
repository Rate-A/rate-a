import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { CatGirlService, CatGirlVoteValue } from './cat-girl-service';
import { CatGirlPersistence } from './cat-girl-persistence';

export function getExpressApp() {
  const app = express();

  app.use(morgan('common'));
  app.use(express.json());

  app.use(
    cors({
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
    })
  );

  const catGirlPersistence = new CatGirlPersistence();

  const catGirlService = new CatGirlService({
    catGirlPersistence,
  });

  // Create a new cat girl
  app.put('/cat-girls', async (_, res) => {
    const catGirl = await catGirlService.createCatGirl();
    res.json({ catGirl });
  });

  // Request upload of a catgirl
  app.put('/cat-girls/:catGirlId/upload', async (req, res) => {
    res.json({
      catGirlId: req.params.catGirlId,
      upload: true,
    });
  });

  // Complete a catgirl upload process
  app.put('/cat-girls/:catGirlId/complete-upload', async (req, res) => {
    res.json({
      catGirlId: req.params.catGirlId,
      upload: true,
    });
  });

  // Show the cat girl
  app.get('/cat-girls/:catGirlId', async (req, res) => {
    const catGirl = await catGirlService.getCatGirl(req.params.catGirlId);

    if (!catGirl) {
      res.status(404);
      res.json({
        message: 'Waifu not found',
      });
      return;
    }

    res.json({ catGirl });
  });

  // Tell the cat girl what you think of her
  app.put('/cat-girls/:catGirlId/vote', async (req, res) => {
    interface CatGirlVoteRequest {
      readonly vote: CatGirlVoteValue;
      readonly dedupId: string;
    }

    const body: CatGirlVoteRequest = req.body;

    const catGirl = await catGirlService.vote({
      catGirlId: req.params.catGirlId,
      dedupId: body.dedupId,
      vote: body.vote,
    });

    if (!catGirl) {
      res.status(404);
      res.json({ message: 'Waifu not found' });
      return;
    }

    res.json({ catGirl });
  });

  return app;
}
