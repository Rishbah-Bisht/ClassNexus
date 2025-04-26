const Attendance = require("../models/Attandance");

async function checkClassTime(req, res, next) {
    const currentDate = new Date();
    const today = currentDate.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const currentHour = currentDate.getHours();

    const classStartHour = 7;  // Class starts at 9 AM
    const classEndHour = 24;   // Class ends at 7 PM
    const className = req.query.className || req.body.className;



    // Check if the current time is within the class hours (9 AM to 7 PM)
    if (currentHour >= classStartHour && currentHour < classEndHour) {
        try {
            // Check if attendance has already been marked for today and for the specific class
            const existingAttendance = await Attendance.findOne({
                class: className,
                date: {
                    $gte: new Date(today + 'T00:00:00.000Z'),
                    $lte: new Date(today + 'T23:59:59.999Z'),
                },
            });

            // Pass the alreadyMarked flag to the route
            req.alreadyMarked = existingAttendance ? true : false;

            // If attendance has already been marked for this class today, render an error
            if (existingAttendance) {
                return res.render("error.ejs", { message: "Attendance already marked for this class today." });
            }

            // If attendance is not already marked, proceed to the next middleware
            return next();
        } catch (err) {
            console.error("Attendance check error:", err);
            return res.status(500).send("Something went wrong while checking attendance.");
        }
    }

    // If the current time is outside class hours, send a message
    return res.render("error.ejs", { message: "Attendance portal is closed. Available from 9 AM to 7 PM only." });

}

module.exports = checkClassTime;
