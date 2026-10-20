import joi from "joi";

const travelschema = joi.object({
  id: joi.string().required(),
  start_point: joi.string().required(),
  end_point: joi.string().required(),
  transport: joi.string().required(),
  trip_duration: joi.number().required(),
  cost: joi.number().required(),
});

export default travelschema;