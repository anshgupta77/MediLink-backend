import doctorModel from "../models/doctorModel.js";
async function filterDoctor(req, res, next) {
    const { speciality } = req.query;
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    var filteredDoctors = doctors;
    if(speciality) {
        filteredDoctors = doctors.filter(doctor => doctor.speciality === speciality);
    }
    req.doctors = filteredDoctors;
    next();
}

export default filterDoctor;