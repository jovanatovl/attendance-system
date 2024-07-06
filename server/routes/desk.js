import { Router } from 'express';
import * as deskController from '../controllers/deskController.js';

const router = Router();

// POST Endpoints
router.route('/').post(deskController.createDesk);

// GET Endpoints
router.route('/').get(deskController.getDesks);

export default router;
