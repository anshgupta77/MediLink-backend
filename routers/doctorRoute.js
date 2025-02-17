import express from "express";
import { doctorList, loginDoctor, appointmentsDoctor, appointmentCompleted, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile, removeAppointment } from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";
import filterDoctor from "../middlewares/filterDoctor.js";
const doctorRouter = express.Router();

doctorRouter.get('/list',filterDoctor, doctorList);
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/appointments',authDoctor, appointmentsDoctor);
doctorRouter.post('/completed-appointment',authDoctor, appointmentCompleted);
doctorRouter.post('/cancel-appointment',authDoctor, appointmentCancel);
doctorRouter.post("/remove-appointment", authDoctor, removeAppointment);
doctorRouter.get('/dashboard',authDoctor, doctorDashboard);
doctorRouter.get('/profile',authDoctor, doctorProfile);
doctorRouter.post('/update-profile',authDoctor, updateDoctorProfile);

export default doctorRouter;