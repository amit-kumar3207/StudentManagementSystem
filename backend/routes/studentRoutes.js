// Import Express
const express = require("express");

// Create Router
const router = express.Router();

// Import Database
const db = require("../config/db");

// Get All Students
router.get("/", (req, res) => {
  // SQL Query
  const sql = "SELECT * FROM students ORDER BY id DESC";

  // Execute Query
  db.query(sql, (error, results) => {
    if (error) {
      console.log(error);

      return res.status(500).json({
        message: "Failed to Fetch Students",
      });
    }

    // Send Students Data
    res.status(200).json(results);
  });
});

// ADD NEW STUDENT (POST API)

router.post("/", (req, res) => {
  // Get Data From Frontend
  const { name, email, phone, course, gender } = req.body;

  // SQL Query
  const sql = `
        INSERT INTO students
        (name, email, phone, course, gender)
        VALUES (?, ?, ?, ?, ?)
    `;

  // Execute Query
  db.query(sql, [name, email, phone, course, gender], (error, result) => {
    if (error) {
      console.log(error);

      return res.status(500).json({
        message: "Failed to Add Student",
      });
    }

    res.status(201).json({
      message: "Student Added Successfully!",
      studentId: result.insertId,
    });
  });
});

// UPDATE STUDENT (PUT API)

router.put("/:id", (req, res) => {
  // Get Student ID From URL
  const studentId = req.params.id;

  // Get Updated Data
  const { name, email, phone, course, gender, status } = req.body;

  // SQL Query
  const sql = `
        UPDATE students
        SET name = ?,
            email = ?,
            phone = ?,
            course = ?,
            gender = ?,
            status = ?
        WHERE id = ?
    `;

  // Execute Query
  db.query(
    sql,
    [name, email, phone, course, gender, status || "Active", studentId],
    (error, result) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          message: "Failed to Update Student",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Student Not Found",
        });
      }

      res.status(200).json({
        message: "Student Updated Successfully!",
      });
    },
  );
});

// DELETE STUDENT (DELETE API)

router.delete("/:id", (req, res) => {
  // Get Student ID
  const studentId = req.params.id;

  // SQL Query
  const sql = "DELETE FROM students WHERE id = ?";

  // Execute Query
  db.query(sql, [studentId], (error, result) => {
    if (error) {
      console.log(error);

      return res.status(500).json({
        message: "Failed to Delete Student",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student Not Found",
      });
    }

    res.status(200).json({
      message: "Student Deleted Successfully!",
    });
  });
});

// Export Router
module.exports = router;
