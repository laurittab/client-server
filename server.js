//Import libraries
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var db = require("./database.js");

//Create web server application
var app = express();

//Set application to use middleware
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://medical-treatments.vercel.app",
    "https://client-records.vercel.app/",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  //credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//The server port
var HTTP_PORT = process.env.PORT || 8080;

//To start server
app.listen(HTTP_PORT, '0.0.0.0', () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

//The root endpoint
app.get("/", (req, res, next) => {
  res.json({ "message": "Ok - Medical Records Server" });
});

//Close the database
app.get("/lhm/logout", (req, res, next) => {
  console.log("Closing the database connection.");
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    res.json({
      "message": "Database closed, restart the server to reconnect.",
    });
  });
});

//List all records of clients' details
app.get("/records", (req, res, next) => {
  let sql = `SELECT client_id, first_name, last_name, date_of_birth, gender, address_line1, address_line2, city, post_code, country, phone, email, comment, allergies FROM record ORDER BY last_name`;
  var params = [];
  console.log("SELECT all client records.");
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows,
    });
  });
});

//Get a record for a single client by clientID
app.get("/records/:clientID", (req, res, next) => {
  var sql = "SELECT * FROM record WHERE client_id = ?";
  var params = [req.params.clientID];
  console.log("SELECT client ID: " + params);
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": row,
    });
  });
});

//Create a new client record
app.post("/record/", (req, res, next) => {
  var errors = [];
  if (!req.body.date_of_birth) {
    errors.push("Date of birth for record not specified");
  }
  if (errors.length) {
    res.status(400).json({ "error": errors.join(",") });
    return;
  }
  var sql =
    "INSERT INTO record (first_name, last_name, date_of_birth, gender, address_line1, address_line2, city, post_code, country, phone, email,comment, allergies, client_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  var data = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    date_of_birth: req.body.date_of_birth,
    gender: req.body.gender,
    address_line1: req.body.address_line1,
    address_line2: req.body.address_line2,
    city: req.body.city,
    post_code: req.body.post_code,
    country: req.body.country,
    phone: req.body.phone,
    email: req.body.email,
    comment: req.body.comment,
    allergies: req.body.allergies,
  };
  var params = [
    data.first_name,
    data.last_name,
    data.date_of_birth,
    data.gender,
    data.address_line1,
    data.address_line2,
    data.city,
    data.post_code,
    data.country,
    data.phone,
    data.email,
    data.comment,
    data.allergies,
  ];
  console.log("INSERT new client named: " + data.last_name);
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success - SAVED NEW CLIENT",
      "data": data,
      "changes": { "new_patient_id": this.lastID },
    });
  });
});

//Update a client record
app.put("/updateRecord/:clientID", (req, res, next) => {
  var sql = `UPDATE record set first_name = COALESCE(?,first_name), last_name = COALESCE(?,last_name), date_of_birth = COALESCE(?,date_of_birth), gender = COALESCE(?,gender), address_line1 = COALESCE(?,address_line1), address_line2 = COALESCE(?,address_line2), city = COALESCE(?,city), post_code = COALESCE(?,post_code), country = COALESCE(?,country), phone = COALESCE(?,phone), email = COALESCE(?,email), comment = COALESCE(?,comment), allergies = COALESCE(?,allergies) WHERE client_id = ?`;
  var params = [req.params.clientID];
  var data = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    date_of_birth: req.body.date_of_birth,
    gender: req.body.gender,
    address_line1: req.body.address_line1,
    address_line2: req.body.address_line2,
    city: req.body.city,
    post_code: req.body.post_code,
    country: req.body.country,
    phone: req.body.phone,
    email: req.body.email,
    comment: req.body.comment,
    allergies: req.body.allergies,
  };
  console.log(
    "UPDATE record: clientID = " +
      params +
      " data.last_name = " +
      data.last_name
  );
  db.run(
    sql,
    [
      data.first_name,
      data.last_name,
      data.date_of_birth,
      data.gender,
      data.address_line1,
      data.address_line2,
      data.city,
      data.post_code,
      data.country,
      data.phone,
      data.email,
      data.comment,
      data.allergies,
      params,
    ],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message });
        return;
      }
      res.json({
        message: "success - UPDATED CLIENT",
        data: data,
        changes: this.changes,
      });
    }
  );
});

//Delete a client record
app.delete("/deleteRecord/:clientID", (req, res, next) => {
  var sql = "DELETE FROM record WHERE client_id = ?";
  var params = [req.params.clientID];
  console.log("DELETE client ID: " + params);
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": res.message });
      return;
    }
    res.json({
      "message": "success - DELETED CLIENT",
      data: params,
      changes: this.changes,
    });
  });
});

//List all treatments
app.get("/treatments", (req, res, next) => {
  let sql = `SELECT treatment_id, treat_course_id, patient_id, practitioner_id, establishment_id, type, treatment_category, issue_date FROM treatment ORDER BY treatment_id`;
  var params = [];
  console.log("SELECT all treatments.");
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows,
    });
  });
});

//Get a single treatment by treatID
app.get("/treatments/:treatID", (req, res, next) => {
  var sql = "SELECT * FROM treatment WHERE treatment_id = ?";
  var params = [req.params.treatID];
  console.log("SELECT treatment ID: " + params);
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": row,
    });
  });
});

//Create a new treatment
app.post("/treatment/", (req, res, next) => {
  var errors = [];
  if (!req.body.treat_course_id) {
    errors.push("Treatment Course for record not specified");
  }
  if (errors.length) {
    res.status(400).json({ "error": errors.join(",") });
    return;
  }
  var sql =
    "INSERT INTO treatment (treat_course_id, patient_id, practitioner_id, establishment_id, type, treatment_category, issue_date, treatment_id) VALUES (?,?,?,?,?,?,?,?)";
  var data = {
    treat_course_id: req.body.treat_course_id,
    patient_id: req.body.patient_id,
    practitioner_id: req.body.practitioner_id,
    establishment_id: req.body.establishment_id,
    type: req.body.type,
    treatment_category: req.body.treatment_category,
    issue_date: req.body.issue_date,
  };
  var params = [
    data.treat_course_id,
    data.patient_id,
    data.practitioner_id,
    data.establishment_id,
    data.type,
    data.treatment_category,
    data.issue_date,
  ];
  console.log("INSERT new treatment for patient: " + data.patient_id);
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success - SAVED NEW TREATMENT",
      "data": data,
      "changes": { "new_treatment_id": this.lastID },
    });
  });
});

//Update a treatment
app.put("/updateTreatment/:treatID", (req, res, next) => {
  var sql = `UPDATE treatment set treat_course_id = COALESCE(?,treat_course_id), patient_id = COALESCE(?,patient_id), practitioner_id = COALESCE(?,practitioner_id), establishment_id = COALESCE(?,establishment_id), type = COALESCE(?,type), treatment_category = COALESCE(?,treatment_category), issue_date = COALESCE(?,issue_date) WHERE treatment_id = ?`;
  var params = [req.params.treatID];
  var data = {
    treat_course_id: req.body.treat_course_id,
    patient_id: req.body.patient_id,
    practitioner_id: req.body.practitioner_id,
    establishment_id: req.body.establishment_id,
    type: req.body.type,
    treatment_category: req.body.treatment_category,
    issue_date: req.issue_date,
  };
  console.log(
    "UPDATE treatment: treatID = " +
      params +
      " data.treat_course_id = " +
      data.treat_course_id
  );
  db.run(
    sql,
    [
      data.treat_course_id,
      data.patient_id,
      data.practitioner_id,
      data.establishment_id,
      data.type,
      data.treatment_category,
      data.issue_date,
      params,
    ],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message });
        return;
      }
      res.json({
        message: "success - UPDATED TREATMENT",
        data: data,
        changes: this.changes,
      });
    }
  );
});

//Delete a treatment
app.delete("/deleteTreatment/:treatID", (req, res, next) => {
  var params = [req.params.treatID];
  var sql = "DELETE FROM treatment WHERE treatment_id = ?";
  console.log("DELETE treatment ID:" + params);
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": res.message });
      return;
    }
    res.json({
      "message": "success - DELETED TREATMENT",
      data: params,
      changes: this.changes,
    });
  });
});

//List all treatment courses
app.get("/treatmentCourses", (req, res, next) => {
  let sql = `SELECT course_id, service_user_id, lead_practitioner_id,  description, start_date, estimated_costs, completion_date, final_costs FROM course ORDER BY course_id`;
  var params = [];
  console.log("SELECT all treatment courses.");
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows,
    });
  });
});

//Get a single treatment course by treatCourseID
app.get("/treatmentCourses/:treatCourseID", (req, res, next) => {
  var sql = "SELECT * FROM course WHERE course_id = ?";
  var params = [req.params.treatCourseID];
  console.log("SELECT treatment course ID: " + params);
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": row,
    });
  });
});

//Create a new treatment course
app.post("/course/", (req, res, next) => {
  var errors = [];
  if (!req.body.service_user_id) {
    errors.push("Service USER ID for record not specified");
  }
  if (errors.length) {
    res.status(400).json({ "error": errors.join(",") });
    return;
  }
  var sql =
    "INSERT INTO course (service_user_id, lead_practitioner_id, description, start_date, estimated_costs, completion_date, final_costs, course_id) VALUES(?,?,?,?,?,?,?,?)";
  var data = {
    service_user_id: req.body.service_user_id,
    lead_practitioner_id: req.body.lead_practitioner_id,
    description: req.body.description,
    start_date: req.body.start_date,
    estimated_costs: req.body.estimated_costs,
    completion_date: req.body.completion_date,
    final_costs: req.body.final_costs,
  };
  var params = [
    data.service_user_id,
    data.lead_practitioner_id,
    data.description,
    data.start_date,
    data.estimated_costs,
    data.completion_date,
    data.final_costs,
  ];
  console.log(
    "INSERT new treatment course for service user: " + data.service_user_id
  );
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success - SAVED NEW TREATMENT COURSE",
      "data": data,
      "changes": { "new_treatment_course_id": this.lastID },
    });
  });
});

//Update a treatment course
app.put("/updateCourse/:treatCourseID", (req, res, next) => {
  var sql = `UPDATE course set service_user_id = COALESCE(?,service_user_id), lead_practitioner_id = COALESCE(?,lead_practitioner_id), description = COALESCE(?,description), start_date = COALESCE(?,start_date), estimated_costs = COALESCE(?,estimated_costs), completion_date = COALESCE(?,completion_date), final_costs = COALESCE(?,final_costs) WHERE course_id = ?`;
  var params = [req.params.treatCourseID];
  var data = {
    service_user_id: req.body.service_user_id,
    lead_practitioner_id: req.body.lead_practitioner_id,
    description: req.body.description,
    start_date: req.body.start_date,
    estimated_costs: req.body.estimated_costs,
    completion_date: req.body.completion_date,
    final_costs: req.body.final_costs,
  };
  console.log(
    "UPDATE treatment course: treatCourseID = " +
      params +
      " data.service_user_id = " +
      data.service_user_id
  );
  db.run(
    sql,
    [
      data.service_user_id,
      data.lead_practitioner_id,
      data.description,
      data.start_date,
      data.estimated_costs,
      data.completion_date,
      data.final_costs,
      req.params.treatCourseID,
    ],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message });
        return;
      }
      res.json({
        message: "success - UPDATED TREATMENT",
        data: data,
        changes: this.changes,
      });
    }
  );
});

//Delete a treatment course
app.delete("/deleteCourse/:treatCourseID", (req, res, next) => {
  var params = [req.params.treatCourseID];
  var sql = "DELETE FROM course WHERE course_id = ?";
  console.log("DELETE treat course ID:" + params);
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": res.message });
      return;
    }
    res.json({
      "message": "success - DELETED TREATMENT COURSE",
      data: params,
      changes: this.changes,
    });
  });
});

//List all treatment courses and records for by client
app.get("/patient/treatment/records/", (req, res, next) => {
  let sql = `SELECT course_id, service_user_id, lead_practitioner_id, description, start_date, estimated_costs, completion_date, final_costs, practitioner_id, establishment_id, type, treatment_category, issue_date, treatment_id from course INNER JOIN treatment on course.course_id = treat_course_id `;
  var params = [];
  console.log(
    "SELECT all treatments as joined with their related treatment courses."
  );
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows,
    });
  });
});

//List all treatment courses and records for a single client
app.get("/patient/treatment/records/:client_id", (req, res, next) => {
  let sql = `SELECT course_id, service_user_id, lead_practitioner_id, description, start_date, estimated_costs, completion_date, final_costs, practitioner_id, establishment_id, type, treatment_category, issue_date, treatment_id from course INNER JOIN treatment on course.course_id = treat_course_id WHERE service_user_id = ?`;
  var params = [req.params.client_id];
  console.log(
    "SELECT all treatments as joined with their related treatment courses for client ID: " +
      params
  );
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows,
    });
  });
});

//Default response for any other request
app.use(function (req, res) {
  res.status(404);
});
