import express from "express";
import TravelController from "../controllers/TravelController.js";

const Router = express.Router();

Router.route("/travel")
  .get(TravelController.getAllTrips)
  .post(TravelController.createTrip);

  Router.route("/travel/:id")
    .get(TravelController.getTripById)
    .put(TravelController.updateTripById)
    .delete(TravelController.deleteTripById);

export default Router;