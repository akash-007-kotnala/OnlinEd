const db = require("../model/db.js");
const COLLECTION_NAME = "classrooms";
const crypto = require('crypto')

exports.getAllClassrooms = async (req, res, next) => {
  const connection = db.getConnection();
  var classrooms = await connection
    .collection(COLLECTION_NAME)
    .find({})
    .toArray();

  console.log(classrooms);
  res.status(200).json({
    status: "success",
    classrooms,
  });
};
exports.createClassroom = async (req, res, next) => {
  const connection = db.getConnection()
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear();
  today = dd + '-' + mm + '-' + yyyy;

  const new_classroom = {
    isActive: false,
    classcode: crypto.randomUUID(),
    authorId: '626126cdd3990228bb87b725' /**TODO: author id */,
    createdAt: today,
    className: req.body.className 
  }
  //console.log(new_classroom)
  const saved_classroom = await connection.collection(COLLECTION_NAME).insertOne(new_classroom)
  //console.log("create classroom",saved_classroom)
  res.status(201).send()
}
exports.getClassroomsOfPerson = async (req, res, next) => {
  //console.log(req.query.email)
  const connection = db.getConnection();
  var classroom = await connection.collection('person').find({ email: req.query.email }).toArray();
  classroom = classroom[0];
  //console.log(classroom)
  //console.log(person)
  res.status(200).json(classroom)
}

exports.addStudentsToClassroom = async (req, res, next) => {
  const connection = db.getConnection();
  var classroom = req.body.classroom;
  console.log(classroom);
  var op = await connection
    .collection(COLLECTION_NAME)
    .updateOne({ _id: req.params.classroomId }, {
      $set: {
        students: classroom.students
      }
    });
  console.log(op);

  res.status(200).json({
    status: "success",
    classroom: classroom
  });
};


exports.getClassroom = async (req, res, next) => {
  const connection = db.getConnection();
  //console.log(req.params.classroomId )
  var classroom = await connection.collection(COLLECTION_NAME).find({ _id: req.params.classroomId }).toArray();
  classroom = classroom[0]

  res.status(200).json(classroom)

}


exports.updateClassroom = async (req, res, next) => {
  const connection = db.getConnection();
  var classroom = req.body.classroom;
  console.log(classroom);
  var op = await connection
    .collection(COLLECTION_NAME)
    .updateOne({ _id: req.params.classroomId }, { $set: classroom });
  console.log(op);

  res.status(200).json({
    status: "success",
  });
};
