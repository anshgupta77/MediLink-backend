import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";


const changeAvailability = async (req, res) => {
    try {
        const {docId} = req.body;
        console.log(docId);
        const docData = await doctorModel.findById(docId);
        console.log(docData);
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
        res.json({ success: true, message: "Availability changed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = req.doctors;
        res.json({ success: true, doctors });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API for Doctor Login
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
            return res.json({ success: true, token });
        }
        else {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const docId = req.docId;
        const doctor = await doctorModel.findById( docId ).populate({
            path: "myAppointments.appointment",
            populate: {
                path: "userData",
                select: "name email image dob",
                model: "user"
            }
        });

        const appointments = doctor.myAppointments;

        res.json({ success: true, appointments });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to mark appointment completed for doctor panel
const appointmentCompleted = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const docId = req.docId;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId == docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });

            const { docId, slotDate, slotTime } = appointmentData;

            const doctorData = await doctorModel.findById(docId);

            let slots_booked = doctorData.slots_booked;

            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

            await doctorModel.findByIdAndUpdate(docId, { slots_booked });

            return res.json({ success: true, message: "Appointment completed successfully" });
        } else {
            return res.json({ success: false, message: "Mark Failed" });
        }
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// API to Cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const docId = req.docId;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId == docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            const { docId, slotDate, slotTime } = appointmentData;

            const doctorData = await doctorModel.findById(docId);

            let slots_booked = doctorData.slots_booked;

            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
            return res.json({ success: true, message: "Appointment cancelled successfully" });
        } else {
            return res.json({ success: false, message: "Cancelled Failed" });
        }
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const docId = req.docId;
        const doctor = await doctorModel.findById( docId ).populate({
            path: "myAppointments.appointment",
            populate: {
                path: "userData",
                select: "name email image dob",
                model: "user"
            }
        });

        const appointments = doctor.myAppointments;

        let earning = 0;

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earning += item.amount;
            }
        });

        let patient = [];

        appointments.map((item) => {
            if (!patient.includes(item.userId)) {
                patient.push(item.userId);
            }
        });

        const dashData = {
            earning,
            appointments: appointments.length,
            patients: patient.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to get doctor profile for Doctor Panel
const doctorProfile = async (req, res) => {
    try {
        const docId = req.docId;
        const profileData = await doctorModel.findById(docId).select(["-password"]);
        res.json({ success: true, profileData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to udpate doctor profile for Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {
        const { fees, address, available } = req.body;
        const docId = req.docId;
        await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
        res.json({ success: true, message: "Profile Updated Successfully" });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const removeAppointment = async (req,res) =>{
    try {
        const docId = req.docId;
        const { appointmentId } = req.body;
        const doctor = await doctorModel.findById(docId);
        const appointments = doctor.myAppointments;
        const newAppointments = appointments.filter(appointment => appointment.appointment.toString() !== appointmentId);
        await doctorModel.findByIdAndUpdate(docId, { myAppointments: newAppointments });
        res.json({ success: true, message: "Appointment removed successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

        



export {
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentCompleted,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    removeAppointment
}