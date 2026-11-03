const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const { DEFAULT_CLASS_BLOCK_PROPS } = require('../config/defaultClassBlockProps');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

const run = async () => {
  const mongoUri = process.env.MONGO_URL || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URL or MONGO_URI must be configured');
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });

  const students = await Student.updateMany(
    {
      $or: [
        { classBlockProps: { $exists: false } },
        { classBlockProps: null },
        { classBlockProps: { $size: 0 } },
      ],
    },
    { $set: { classBlockProps: DEFAULT_CLASS_BLOCK_PROPS } }
  );

  const allStudentIds = (await Student.find({}, '_id')).map(
    (student) => student._id
  );

  const teachers = await Teacher.updateMany(
    {
      $or: [
        { students: { $exists: false } },
        { students: null },
        { students: { $size: 0 } },
      ],
    },
    { $set: { students: allStudentIds } }
  );

  console.log(`Backfilled classBlockProps on ${students.modifiedCount} students`);
  console.log(`Linked students on ${teachers.modifiedCount} teachers`);

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error('Backfill failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
