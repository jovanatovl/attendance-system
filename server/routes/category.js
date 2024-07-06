import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';

const router = Router();

// POST Endpoints
router.route('/').post(categoryController.createCategory);

// GET Endpoints
router.route('/').get(categoryController.getCategories);

export default router;
