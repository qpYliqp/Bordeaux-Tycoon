import express from 'express';
import users from './userRoutes.js';
import buildings from './buildingRoutes.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Bordeaux Tycoon API",
            version: "1.0.0",
            description: "Bordeaux Tycoon API Informations"
        }
    },
    apis: ["./src/routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const router = express.Router();
router.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.use("/users", users);
router.use("/buildings", buildings);

export default router;

export function defaultHandler(res, functionResult, successStatus = 200) {
    if (!functionResult.success) {
        let status = 404;
        if (functionResult.error) {
            status = 400;
        }

        res.status(status).send(functionResult.message);
        return;
    }

    res.status(successStatus).send(functionResult.data);
}