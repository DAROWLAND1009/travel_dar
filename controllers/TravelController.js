import database from "../services/database.js";
import {
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import travelschema from "../models/trip.js";


async function getAllTrips(req, res, next) {
  try {
    const params = {
      TableName: "Travel",
    };
    const command = new ScanCommand(params);
    const result = await database.send(command);
    res.status(200).json(result.Items);
  } catch (err) {
    next(err);
  }
}
 
  async function createTrip(req, res, next) {
    try {
      const uuid = uuidv4();
      req.body.id = uuid;
      const { error, value } = travelschema.validate(req.body);
  
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }
  
      const { id, start_point, end_point, transport, trip_duration, cost } = value;
  
      const params = {
        TableName: "Travel",
        Item: {
          id,
          start_point,
          end_point,
          transport,
          trip_duration,
          cost,
        },
  }

const command = new PutCommand(params);

await database.send(command);

res
  .status(201)
  .json({ message: "Successfully created trip", 
  data: params.Item });
} catch (error) {
  next(error);
}
}
async function getTripById(req, res, next) {
      const TripId = req.params.id; // <-- this is where we get the id from the request url
      try {
        const params = {
          TableName: "Travel",
          Key: { id: TripId },
        };
        const command = new GetCommand(params);
        const result = await database.send(command);
        if (!result.Item) {
          return res.status(404).json({ message: "No account found" });
        }
        res.status(200).json(result.Item);
      } catch (err) {
        next(err);
      }
}
    
async function updateTripById(req, res, next) {
  try {
      const TripId = req.params.id; // <-- this is where we get the id from the request url
      req.body.id = TripId;
      const { error, value } = travelschema.validate(req.body);
  
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
      const { id, start_point, end_point, transport, trip_duration, cost } = value;
  
      // Get the movie from DynamoDB
      const getParams = {
        TableName: "Travel",
        Key: { id: TripId },
      };
  
      const getCommand = new GetCommand(getParams);
  
      const result = await database.send(getCommand);
  
      const trip = result.Item;
  
      if (!trip) {
        return res.status(404).json({ message: "No account found" });
      }
  
      // Update the account in DynamoDB
      const updateParams = {
        TableName: "Travel",
        Key: { id: TripId },
        UpdateExpression:
          "set #start_point = :start_point, #end_point = :end_point, #transport = :transport, #trip_duration = :trip_duration, #cost = :cost",
        ExpressionAttributeNames: {
          "#start_point": "start_point",
          "#end_point": "end_point",
          "#transport": "transport",
          "#trip_duration": "trip_duration",
          "#cost": "cost",
        },
        ExpressionAttributeValues: {
          ":start_point": start_point,
          ":end_point": end_point,
          ":transport": transport,
          ":trip_duration": trip_duration,
          ":cost": cost
        },
        ReturnValues: "ALL_NEW",
      };
      const updateCommand = new UpdateCommand(updateParams);
      const updatedAccount = await database.send(updateCommand);
  
      res.status(200).json(updatedAccount.Attributes);
    } catch (err) {
      next(err);
    }
}
    
async function deleteTripById(req, res, next) {
      const TripId = req.params.id; // <-- this is where we get the id from the request url
      try{
        const params = {
          TableName: "Travel",
          Key: { id: TripId },
        };
        const command = new DeleteCommand(params);
        await database.send(command);
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    }
  
  
  export default {
    getAllTrips,
    createTrip,
    getTripById,
    deleteTripById,
    updateTripById,
  };