const express = require('express');
const { getUserPreferences, saveUserPreferences } = require('../controllers/userPreferencesController');

const router = express.Router();

/**
 * @swagger
 * /api/user-preferences:
 *   get:
 *     summary: Get user preferences
 *     description: Retrieves the user preferences from the server
 *     tags: [User Preferences]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPreferences'
 *       500:
 *         description: Server error
 */
router.get('/', getUserPreferences);

/**
 * @swagger
 * /api/user-preferences:
 *   post:
 *     summary: Save user preferences
 *     description: Saves the user preferences to the server
 *     tags: [User Preferences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPreferences'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/', saveUserPreferences);

module.exports = router;
