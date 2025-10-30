import express from 'express';
import { createUser, getUserByEmail, generateToken, getUserById, authenticateToken, userHasAuthenticated, getRanks }
    from '../controllers/userController.js';
import { getSharesByUserId } from '../controllers/shareController.js';
import { defaultHandler } from './router.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Everything related to users
 */

/**
 * @swagger
 * /api/users/:
 *  post:
 *      tags: [Users]
 *      description: Create a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/UserCreation'
 *      responses:
 *          201:
 *              description: User created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *              headers:
 *                  Authorization:
 *                      schema:
 *                          type: string
 *                          description: The user authentication token
 *          400:
 *              description: Error while creating user
 *          409:
 *              description: User already exists
 */
router.post("/", (req, res) => {
    const body = req.body;

    // Generate salt
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            res.status(400).send("Cannot create user:\n" + err);
            return;
        }

        // Hash password
        bcrypt.hash(body.password, salt, (err, hash) => {
            if (err) {
                res.status(400).send("Cannot create user:\n" + err);
                return;
            }

            // Create user
            body.passwordHash = hash;
            createUser(body).then((result) => {
                if (result.success) {
                    const token = generateToken(result.data._id);
                    res.status(201)
                        .header('Authorization', "Bearer " + token)
                        .send(result.data);
                } else {
                    res.status(409).send(result.message);
                }
            });
        });
    });
});

/**
 * @swagger
 * /api/users/auth:
 *  post:
 *      tags: [Users]
 *      description: Authentication of an user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserAuthentication'
 *      responses:
 *          202:
 *              description: Login infos accepted, user authenticated
 *              headers:
 *                  Authorization:
 *                      schema:
 *                          type: string
 *                          description: The user authentication token
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          400:
 *              description: User not found or wrong password
 */
router.post("/auth", (req, res) => {
    const body = req.body;
    getUserByEmail(body.email).then((result) => {
        if (result.success) {
            bcrypt.compare(body.password, result.passwordHash, async (err, same) => {
                if (err) {
                    res.status(400).send("Cannot authenticate user:\n" + err);
                    return;
                }

                if (same) {
                    const token = generateToken(result.user.id);
                    const user = await userHasAuthenticated(result.user.id);
                    res.status(202)
                        .header('Authorization', "Bearer " + token)
                        .send(user);
                } else {
                    res.status(400).send("Cannot authenticate user:\nWrong user/password");
                }
            });
        } else {
            res.status(400).send("Cannot authenticate user:\nWrong user/password");
        }
    });
});

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *      tags: [Users]
 *      description: Fetch a user by its id
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            required: true
 *            description: The user id
 *      responses:
 *          200:
 *              description: User found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          400:
 *              description: Error while fetching user
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: User not found
 */
router.get("/:id", authenticateToken, (req, res) => {
    getUserById(req.params.id).then((result) => {
        defaultHandler(res, result);
    });
});


/**
 * @swagger
 * /api/users/{id}/shares:
 *  get:
 *      tags: [Users]
 *      description: Fetch shares of a user by its id
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            required: true
 *            description: The user id
 *      responses:
 *          200:
 *              description: Shares found
 *              content:
 *                  application/json:
 *                      type: array
 *                      description: The user shares
 *                      $ref: '#/components/schemas/Share'
 *          400:
 *              description: Error while fetching shares
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: User not found
 */
router.get("/:id/shares", authenticateToken, (req, res) => {
    getSharesByUserId(req.params.id).then((result) => {
        defaultHandler(res, result);
    });
});

/**
 * @swagger
 * /api/users/:
 *  get:
 *      tags: [Users]
 *      description: Fetch the 500 best users by their hourly income
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Ranks found
 *              content:
 *                  application/json:
 *                      type: array
 *                      description: The 500 best users, ordered by their hourly income
 *                      $ref: '#/components/schemas/User'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/", authenticateToken, (req, res) => {
    getRanks().then((result) => {
        defaultHandler(res, result);
    });
});

export default router;

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - id
 *              - username
 *              - email
 *              - money
 *              - buildingCount
 *              - hourlyIncome
 *          properties:
 *              id:
 *                  type: string
 *                  description: The user id
 *              username:
 *                  type: string
 *                  description: The user username
 *              email:
 *                  type: string
 *                  description: The user email
 *              money:
 *                  type: number
 *                  description: The money currently owned by the user
 *              buildingCount:
 *                  type: number
 *                  description: The number of properties owned by the user
 *              hourlyIncome:
 *                  type: number
 *                  description: The income generated by the user every hour
 *          example:
 *              id: 1
 *              username: Jean
 *              email: jean@test.com
 *              money: 10000
 *              buildingCount: 7
 * 
 *      UserCreation:
 *          type: object
 *          required:
 *              - email
 *              - username
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  description: The user email
 *              username:
 *                  type: string
 *                  description: The user username
 *              password:
 *                  type: string
 *                  description: The user password
 *          example:
 *              email: jean@test.com
 *              username: Jean
 *              password: test
 * 
 *      UserAuthentication:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  description: The user email
 *              password:
 *                  type: string
 *                  description: The user password
 *          example:
 *              email: jean@test.com
 *              password: test
 * 
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 * 
 *  responses:
 *      UnauthorizedError:
 *          description: Access token is missing or invalid
 */
