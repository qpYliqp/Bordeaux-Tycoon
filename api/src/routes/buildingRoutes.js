import express from 'express';
import { authenticateToken } from '../controllers/userController.js';
import { getBuildings, getBuildingById } from '../controllers/buildingController.js';
import { buyShares, getSharesByBuildingId, sellShares } from '../controllers/shareController.js';
import { defaultHandler } from './router.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Buildings
 *  description: Everything related to buildings.
 */

/**
 * @swagger
 * /api/buildings/:
 *  get:
 *      tags: [Buildings]
 *      description: Fetch all buildings. Buildings can be filtered by theme and name. Pagination is available. However, if no pagination is specified, all buildings will be returned.
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: query
 *            name: theme
 *            schema:
 *              type: string
 *            required: false
 *            description: The theme of the building
 *          - in: query
 *            name: name
 *            schema:
 *              type: string
 *            required: false
 *            description: The name of the building. Case insensitive.
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *            required: false
 *            description: The page number to start with. If it is not specified and elementsPerPage is specified, the first page will be returned.
 *          - in: query
 *            name: elementsPerPage
 *            schema:
 *              type: integer
 *            required: false
 *            description: The number of elements to display per page. If it is not specified and page is specified, it will be 10.
 *      responses:
 *          200:
 *              description: Buildings found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/BuildingPreview'
 *          400:
 *              description: Error with paging parameters
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/", authenticateToken, (req, res) => {
    const filter = {};
    if (req.query.theme) {
        filter.theme = req.query.theme;
    }

    if (req.query.name) {
        filter.name = { $regex: req.query.name, $options: "i" };
    }

    let elementsPerPage = 0;
    let page = 0;
    try {
        if (req.query.page) {
            elementsPerPage = 10;
            page = parseInt(req.query.page);

            if (req.query.elementsPerPage) {
                elementsPerPage = parseInt(req.query.elementsPerPage);
            }
        }
        else if (req.query.elementsPerPage) {
            elementsPerPage = parseInt(req.query.elementsPerPage);
        }
    } catch (error) {
        res.status(400).send({ message: "page or elementsPerPage should be integers" });
        return;
    }

    const options = { limit: elementsPerPage, skip: (page) * elementsPerPage };

    getBuildings(filter, options).then((result) => {
        res.status(200).send(result.data);
    });
});

/**
 * @swagger
 * /api/buildings/{id}/:
 *  get:
 *      tags: [Buildings]
 *      description: Fetch a specific building
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The building id
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Building found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Building'
 *          400:
 *              description: Error while fetching building
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: Building does not exist
 */
router.get("/:id/", authenticateToken, (req, res) => {
    getBuildingById(req.params.id).then((result) => {
        defaultHandler(res, result);
    });
});

/**
 * @swagger
 * /api/buildings/{id}/shares/:
 *  post:
 *      tags: [Buildings]
 *      description: Buy shares in a building
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The building id
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ShareTransaction'
 *      responses:
 *          201:
 *              description: Shares bought
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Share'
 *          400:
 *              description: Error while buying shares
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: Building or user not found
 *          406:
 *              description: Not enough money or shares available
 */
router.post("/:id/shares/", authenticateToken, (req, res) => {
    const body = req.body;

    buyShares(req.params.id, body.id, body.amount).then((result) => {
        if (result.error) {
            res.status(400).send(result.message);
            return;
        }

        if (result.cannot) {
            res.status(406).send(result.message);
            return;
        }

        if (!result.success) {
            res.status(404).send(result.message);
            return;
        }

        res.status(201).send(result.data);
    });
});

/**
 * @swagger
 * /api/buildings/{id}/shares/:
 *  delete:
 *      tags: [Buildings]
 *      description: Sell shares of a building
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The building id
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ShareTransaction'
 *      responses:
 *          200:
 *              description: Shares sold
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Share'
 *          204:
 *              description: All shares sold
 *          400:
 *              description: Error while selling shares
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: Share not found
 */
router.delete("/:id/shares/", authenticateToken, (req, res) => {
    const body = req.body;

    sellShares(req.params.id, body.id, body.amount).then((result) => {
        if (!result.success) {
            let status = 404;
            if (result.error) {
                status = 400;
            }

            res.status(status).send(result.message);
            return;
        }

        if (result.data) {
            res.status(200).send(result.data);
        }
        else {
            res.status(204).send();
        }
    });
});

/**
 * @swagger
 * /api/buildings/{id}/shares:
 *  get:
 *      tags: [Buildings]
 *      description: Fetch all shares in a building
 *      parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            required: true
 *            description: The building id
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Shares found
 *              content:
 *                  application/json:
 *                      type: array
 *                      description: The building shares
 *                      $ref: '#/components/schemas/Share'
 *          400:
 *              description: Error while fetching shares
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: Building not found
 */
router.get("/:id/shares/", authenticateToken, (req, res) => {
    getSharesByBuildingId(req.params.id).then((result) => {
        defaultHandler(res, result);
    });
});

export default router;

/**
 * @swagger
 * components:
 *  schemas:
 *      BuildingPreview:
 *          type: object
 *          required:
 *              - id
 *              - name
 *              - theme
 *              - importance
 *              - town
 *              - remainingShares
 *          properties:
 *              id:
 *                  type: string
 *                  description: The building ID
 *              name:
 *                  type: string
 *                  description: The building name
 *              theme:
 *                  type: string
 *                  description: The building main theme
 *              importance:
 *                  type: number
 *                  description: The impact of the building on the city / region
 *              town:
 *                  type: string
 *                  description: The town in which the building is located
 *              remainingShares:
 *                  type: number
 *                  description: The remaining shares available to buy
 *          example:
 *              id: 5f9a4a1c8d6b2d001f6e8e6f
 *              name: "CREMI"
 *              theme: "J"
 *              importance: 2
 *              town: "Bordeaux"
 *              remainingShares: 10000
 * 
 *      Building:
 *          type: object
 *          required:
 *              - id
 *              - name
 *              - theme
 *              - subtheme
 *              - status
 *              - town
 *              - importance
 *              - longitude
 *              - latitude
 *              - remainingShares
 *              - price
 *          properties:
 *              id:
 *                  type: string
 *                  description: The building ID
 *              name:
 *                  type: string
 *                  description: The building name
 *              theme:
 *                  type: string
 *                  description: The building main theme
 *              subtheme:
 *                  type: string
 *                  description: The building subtheme
 *              status:
 *                  type: string
 *                  description: The building IRL ownership status
 *              town:
 *                  type: string
 *                  description: The town where the building is located
 *              importance:
 *                  type: number
 *                  description: The impact of the building on the city / region
 *              longitude:
 *                  type: number
 *                  description: The building longitude
 *              latitude:
 *                  type: number
 *                  description: The building lattiude
 *              remainingShares:
 *                  type: number
 *                  description: The remaining shares available to buy
 *              price:
 *                  type: number
 *                  description: The building total price
 *          example:
 *              id: 5f9a4a1c8d6b2d001f6e8e6f
 *              name: "CREMI"
 *              theme: "J"
 *              subtheme: "J1"
 *              status: "Public"
 *              town: "Bordeaux"
 *              importance: 2
 *              longitude: 44.837789
 *              latitude: -0.57918
 *              remainingShares: 10000
 *              price: 40000
 */