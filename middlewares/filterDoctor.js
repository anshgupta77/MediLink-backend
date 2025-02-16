import doctorModel from "../models/doctorModel.js";

async function filterDoctor(req, res, next) {
    const { speciality, search } = req.query;
    let query = {};

    if (speciality) {
        query.speciality = speciality; // Filter by speciality
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },  // Search by doctor name (case insensitive)
            { speciality: { $regex: search, $options: "i" } } // Search by speciality
        ];
    }

    const doctors = await doctorModel.find(query);
    req.doctors = doctors;
    next();
}

export default filterDoctor;