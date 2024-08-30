const { body, validationResult } = require("express-validator");
const { attendances, students, timetables } = require("./db/schema");
const db = require("./db/db");
const { eq } = require("drizzle-orm");

const validateAttendance = [
    body("user_id").notEmpty().withMessage("user_id is required"),
    body("timetable_id").notEmpty().withMessage("timetable_id is required"),
];

const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Run validations
    for (const validation of validateAttendance) {
        await runMiddleware(req, res, validation);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        // Check if student exists
        const studentResult = await db
            .select()
            .from(students)
            .where(eq(students.userId, req.body.user_id))
            .limit(1);
        if (studentResult.length === 0) {
            return res.status(422).json({ message: "Student not found" });
        }
        const student = studentResult[0];

        // Check if timetable exists
        const timetableResult = await db
            .select()
            .from(timetables)
            .where(eq(timetables.id, req.body.timetable_id))
            .limit(1);
        if (timetableResult.length === 0) {
            return res.status(422).json({ message: "Timetable not found" });
        }

        // Create attendance record
        await db.insert(attendances).values({
            student_id: student.id,
            timetable_id: req.body.timetable_id,
        });

        // Send response
        res.status(201).json({
            message: "You have successfully submitted attendance for today's class.",
        });
    } catch (error) {
        console.error(error);
        res
            .status(422)
            .json({ message: "An error occurred while processing your request" });
    }
};




// const {body, validationResult} = require("express-validator");
// const db = require("./db/db");
// const {students, timetables, attendances} = require("./db/schema");
// const {eq} = require("drizzle-orm");
// const {authenticateToken} = require("./auth");
//
// const attendance = [
//     authenticateToken,
//     body("user_id").notEmpty().withMessage("user_id is required"),
//     body("timetable_id").notEmpty().withMessage("timetable_id is required"),
//     async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(422).json({ errors: errors.array() });
//         }
//
//         try {
//             // Check if student exists
//             const studentResult = await db
//                 .select()
//                 .from(students)
//                 .where(eq(students.userId, req.body.user_id))
//                 .limit(1);
//             if (studentResult.length === 0) {
//                 return res.status(422).json({ message: "Student not found" });
//             }
//             const student = studentResult[0];
//
//             // Check if timetable exists
//             const timetableResult = await db
//                 .select()
//                 .from(timetables)
//                 .where(eq(timetables.id, req.body.timetable_id))
//                 .limit(1);
//             if (timetableResult.length === 0) {
//                 return res.status(422).json({ message: "Timetable not found" });
//             }
//
//             // Create attendance record
//             await db.insert(attendances).values({
//                 student_id: student.id,
//                 timetable_id: req.body.timetable_id,
//             });
//
//             // Send response
//             res.status(201).json({
//                 message:
//                     "You have successfully submitted attendance for today's class.",
//             });
//         } catch (error) {
//             console.error(error);
//             res
//                 .status(422)
//                 .json({ message: "An error occurred while processing your request" });
//         }
//     },
// ];
//
//
// module.exports = {attendance}