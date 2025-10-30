/**
 * @swagger
 * components:
 *  schemas:
 *      Share:
 *          type: object
 *          required:
 *              - owner
 *              - building
 *              - amount
 *          properties:
 *              owner:
 *                  $ref: '#/components/schemas/User'
 *                  description: The owner of the share
 *              building:
 *                  $ref: '#/components/schemas/BuildingPreview'
 *                  description: The building the share is associated with
 *              amount:
 *                  type: number
 *                  description: The amount of shares. 1 share equals 0.01% of the building
 *          example:
 *              owner:
 *                  id: 5f9a4a1c8d6b2d001f6e8e6f
 *                  username: "Jean"
 *                  email: "jean@test.com"
 *                  money: 10000
 *              building:
 *                  id: 5f9a4a1c8d6b2d001f6e8e6f
 *                  name: "CREMI"
 *                  theme: "J"
 *                  importance: 2
 *                  town: "Bordeaux"
 *                  remainingShares: 9900
 *              amount: 100
 * 
 *      ShareTransaction:
 *          type: object
 *          required:
 *              - id
 *              - amount
 *          properties:
 *              id:
 *                  type: string
 *                  description: The buyer/seller ID
 *              amount:
 *                  type: number
 *                  description: The amount of shares to buy or sell. 1 share = 0.01% of the building.
 *          example:
 *              id: 5f9a4a1c8d6b2d001f6e8e6f
 *              amount: 5
 */