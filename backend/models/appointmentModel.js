const Joi = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema

const appointmentSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      required: true,
    },
    doctorInfo: {
      type: String,
      required: true,
    },
    userInfo: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const appointmentJoiSchema = Joi.object({
  userId: Joi.string().required(),
  doctorId: Joi.string().required(),
  doctorInfo: Joi.string().required(),
  userInfo: Joi.string().required(),
  date: Joi.date().required(),
  status: Joi.string().required().default("pending"),
  time: Joi.string().required(),
}).options({ stripUnknown: true });

const AppointmentModel = mongoose.model("appointments", appointmentSchema);

AppointmentModel.validateAppointment = async function () {
  return appointmentJoiSchema.validateAsync(this.toObject());
};

module.exports = AppointmentModel;
