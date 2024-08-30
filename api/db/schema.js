const {sqliteTable, integer, text} = require("drizzle-orm/sqlite-core");
const {sql,relations} = require("drizzle-orm");

const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    created_at: text('created_at').notNull().default(sql`(current_timestamp)`),
    updated_at: text('updated_at').notNull().default(sql`(current_timestamp)`),
});

const usersRelations = relations(users, ({ one }) => ({
    students: one(students),
}));

const students = sqliteTable('students', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('userId').references(() => users.id),
    admission_number: text('admission_number').notNull(),
    created_at: text('created_at').notNull().default(sql`(current_timestamp)`),
    updated_at: text('updated_at').notNull().default(sql`(current_timestamp)`),
})

const studentsRelations = relations(students, ({ one }) => ({
    user: one(users, { fields: [students.userId], references: [users.id] }),
}));

const courses = sqliteTable('courses', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('userId').references(() => users.id),
    course_name: text('course_name').notNull(),
    course_code: text('course_code').notNull(),
    created_at: text('created_at').notNull().default(sql`(current_timestamp)`),
    updated_at: text('updated_at').notNull().default(sql`(current_timestamp)`),
})

const timetables = sqliteTable('timetables', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    courseId: integer('courseId').references(() => courses.id),
    timetable_code: text('timetable_code').notNull(),
    location_name: text('location_name').notNull(),
    lesson_date: text('lesson_date').notNull(),
    start_time: text('start_time').notNull(),
    end_time: text('end_time').notNull(),
    created_at: text('created_at').notNull().default(sql`(current_timestamp)`),
    updated_at: text('updated_at').notNull().default(sql`(current_timestamp)`),
})


const attendances = sqliteTable('attendances', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    studentId: integer('studentId').references(() => students.id),
    timetableId: integer('timetableId').references(() => students.id),
    created_at: text('created_at').notNull().default(sql`(current_timestamp)`),
    updated_at: text('updated_at').notNull().default(sql`(current_timestamp)`),
})


module.exports = { users, students, usersRelations, studentsRelations, timetables, courses, attendances };