//Import SQLite3
var sqlite3 = require("sqlite3").verbose();

//Open a new read-write database
let db = new sqlite3.Database("patient_records.db", (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log("Connected to the patient_records database.");
});

//Create the 'treatment' table for treatment data
const sqlTreatment =
  "CREATE TABLE treatment (treat_course_id INTEGER NOT NULL, patient_id INTEGER NOT NULL, practitioner_id INTEGER NOT NULL, establishment_id INTEGER INTEGER NOT NULL, type TEXT NOT NULL, treatment_category TEXT NOT NULL, issue_date TEXT NOT NULL, treatment_id INTEGER PRIMARY KEY)";

//Insert treatment rows
db.run(sqlTreatment, (err) => {
  if (err) {
    console.log("Treatment table already created.");
  } else {
    console.log("Treatment table created. Rows are now being created.");

    var insert =
      "INSERT INTO treatment (treat_course_id, patient_id, practitioner_id, establishment_id, type, treatment_category, issue_date, treatment_id) VALUES(?,?,?,?,?,?,?,?)";
    db.run(insert, [
      "600001",
      "10000001",
      "2011",
      "7011",
      "Initial consultation",
      "Consultations and check-up ",
      "2020-05-23",
      "300001",
    ]);
    db.run(insert, [
      "600001",
      "10000001",
      "2001",
      "8001",
      "Capsule colonoscopy",
      "Operations and vaccinations",
      "2020-06-28",
      "300002",
    ]);
    db.run(insert, [
      "600001",
      "10000001",
      "2011",
      "3011",
      "Follow-up consultation",
      "Consultations and check-up",
      "2020-07-01",
      "300003",
    ]);
    db.run(insert, [
      "600002",
      "10000002",
      "2011",
      "3012",
      "Repeat prescription for antibiotics",
      "Prescriptions and repeat Prescriptions",
      "2020-07-11",
      "300004",
    ]);
    db.run(insert, [
      "600002",
      "10000002",
      "2010",
      "3012",
      "One off prescription for pain killers ",
      "Prescriptions and repeat Prescriptions",
      "2020-08-01",
      "300005",
    ]);
    db.run(insert, [
      "600003",
      "10000002",
      "2008",
      "3100",
      "Pfizer covid vaccination",
      "Operations and vaccinations",
      "2021-09-21",
      "300006",
    ]);
    db.run(insert, [
      "600004",
      "10000003",
      "2108",
      "3101",
      "Cocodomal gel",
      "Medicine and different types of tablets",
      "2021-10-01",
      "300007",
    ]);
    db.run(insert, [
      "600005",
      "10000004",
      "2118",
      "3489",
      "Health assessment",
      "Clinical reports and attached documents and history",
      "2021-10-01",
      "300008",
    ]);
    db.run(insert, [
      "600006",
      "10000005",
      "2118",
      "3489",
      "Health assessment",
      "Clinical reports and attached documents and history",
      "2022-01-03",
      "300009",
    ]);
  }
});

//Create 'course' table for treatment course data
const sqlCourse =
  "CREATE TABLE course (service_user_id INTEGER NOT NULL, lead_practitioner_id INTEGER NOT NULL, description TEXT NOT NULL, start_date TEXT NOT NULL, estimated_costs TEXT NOT NULL, completion_date TEXT, final_costs TEXT, course_id INTEGER PRIMARY KEY)";

//Insert course rows
db.run(sqlCourse, (err) => {
  if (err) {
    console.log("Course table already created.");
  } else {
    console.log("Course table created. Rows are now being created.");

    var insert =
      "INSERT INTO course (service_user_id, lead_practitioner_id, description, start_date, estimated_costs, completion_date, final_costs, course_id) VALUES(?,?,?,?,?,?,?,?)";
    db.run(insert, [
      "10000001",
      "2011",
      "Suspected gastric ulcer, consultation and investigations",
      "2020-05-23",
      "£520.00",
      "2020-07-01",
      "£615.00",
      "600001",
    ]);
    db.run(insert, [
      "10000002",
      "2011",
      "Antibiotics and pain relief for chest infection",
      "2020-07-11",
      "£120.00",
      "2020-07-11",
      "£95.00",
      "600002",
    ]);
    db.run(insert, [
      "10000002",
      "2008",
      "2x covid vaccinations",
      "2021-09-21",
      "£150.00",
      "TBC",
      "TBC",
      "600003",
    ]);
    db.run(insert, [
      "10000003",
      "2108",
      "Investigating topical knee pain relief",
      "2021-10-01",
      "£25.00",
      "TBC",
      "TBC",
      "600004",
    ]);
    db.run(insert, [
      "10000004",
      "2118",
      "Review of medical records for possible surgery",
      "2021-10-01",
      "£125.00",
      "2021-11-03",
      "TBC",
      "600005",
    ]);
    db.run(insert, [
      "10000005",
      "2118",
      "Review of medical records for possible surgery",
      "2022-01-11",
      "£225.00",
      "2022-11-22",
      "£250",
      "600006",
    ]);
  }
});

//Create 'record' table for client data
const sqlPatient =
  "CREATE TABLE record (first_name TEXT NOT NULL, last_name TEXT NOT NULL, date_of_birth TEXT NOT NULL, gender TEXT, address_line1 TEXT NOT NULL, address_line2 TEXT, city TEXT NOT NULL, post_code TEXT NOT NULL, country TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, comment TEXT, allergies TEXT NOT NULL, client_id INTEGER PRIMARY KEY)";

//Insert patient record rows
db.run(sqlPatient, (err) => {
  if (err) {
    console.log("Patient Table already created.");
  } else {
    console.log("Patient table created. Rows are now being created.");

    var insert =
      "INSERT INTO record (first_name, last_name, date_of_birth, gender, address_line1, address_line2, city, post_code, country, phone, email, comment, allergies, client_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.run(insert, [
      "Larry",
      "Burrows",
      "1990-03-06",
      "Male",
      "Flat C",
      "2 Heights Villa",
      "Caroline Close",
      "BU23 910",
      "United Kingdom",
      "079689 3345",
      "larry@gmail.com",
      "Needle phobia, prefers oral medications",
      "None",
      "10000001",
    ]);
    db.run(insert, [
      "Carla",
      "Todd",
      "1993-06-23",
      "Female",
      "Beachville",
      "The New World",
      "100 Walt Disney",
      "BHY7 88A",
      "United Kingdom",
      "079999 1235",
      "carla@yahoo.com",
      "Pencillin allergy",
      "Drug",
      "10000002",
    ]);
    db.run(insert, [
      "Rita",
      "Blanchette",
      "1990-03-06",
      "Female",
      "Flat C",
      "2 McNeal Road",
      "Paris",
      "BHY7 88A",
      "United Kingdom",
      "079999 1235",
      "rita@yahoo.co.uk",
      "Pencillin allergy",
      "Pet",
      "10000003",
    ]);
    db.run(insert, [
      "Emmanuel",
      "Smith",
      "1996-09-19",
      "Female",
      "High Castle Mode",
      "Halley Avenue",
      "New York",
      "445 6201",
      "USA",
      "079771 134 890",
      "manny@post.ir",
      "",
      "None",
      "10000004",
    ]);
    db.run(insert, [
      "Samin",
      "Smith",
      "1976-05-17",
      "Female",
      "Run-Up Doors",
      "13 Holiday Vales",
      "Moscow",
      "W9 6AM",
      "Russia",
      "079771 134 890",
      "sammy@gmail.com",
      "",
      "None",
      "10000005",
    ]);
  }
});

//Export as a module called db
module.exports = db;
