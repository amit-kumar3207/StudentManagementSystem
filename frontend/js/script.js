// STUDENT DATA


// Students Data From MySQL Database

let students = [];

// Backend API URL
const API_URL = "http://localhost:5000/api/students";

// GET STUDENTS FROM DATABASE

async function getStudents() {
  try {
    // Send GET Request to Backend
    const response = await fetch(API_URL);

    // Convert Response into JSON
    const data = await response.json();

    students = data;

updateDashboard();
displayRecentStudents();
displayCourses();
filterStudents();
  } catch (error) {
    console.log("Error Fetching Students:", error);
  }
}

// DASHBOARD FUNCTION

function updateDashboard() {
  // Total Students
  const totalStudents = document.getElementById("totalStudents");

  totalStudents.textContent = students.length;

  // Total Courses
  const courses = [...new Set(students.map((student) => student.course))];

  document.getElementById("totalCourses").textContent = courses.length;

  // Active Students
  const activeStudents = students.filter(
    (student) => student.status === "Active",
  );

  document.getElementById("activeStudents").textContent = activeStudents.length;

  // New Admissions (Last 7 Days)

  const today = new Date();

  const lastSevenDays = new Date();

  lastSevenDays.setDate(today.getDate() - 7);

  const newAdmissions = students.filter(function (student) {
    const admissionDate = new Date(student.created_at);

    return admissionDate >= lastSevenDays && admissionDate <= today;
  });

  document.getElementById("newAdmissions").textContent = newAdmissions.length;
}


// ==============================
// DISPLAY RECENT STUDENTS
// ==============================

function displayRecentStudents() {

    const recentStudentsTableBody =
        document.getElementById("recentStudentsTableBody");

    // Get Latest 5 Students
    const recentStudents = [...students]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    // Clear Previous Data
    recentStudentsTableBody.innerHTML = "";

    // Display Students
    recentStudents.forEach(function (student) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>
    <span class="status-badge ${student.status.toLowerCase()}">
        ${student.status}
    </span>
</td>
        `;

        recentStudentsTableBody.appendChild(row);

    });

}

// LOAD STUDENTS FROM DATABASE

getStudents();

// Currently Editing Student ID
let editingStudentId = null;

const studentForm = document.getElementById("studentForm");

studentForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Get Form Values
  const name = document.getElementById("studentName").value;
  const email = document.getElementById("studentEmail").value;
  const phone = document.getElementById("studentPhone").value;
  const course = document.getElementById("studentCourse").value;
  const gender = document.getElementById("studentGender").value;

  if (editingStudentId !== null) {
    // Send Updated Data to Backend
    const response = await fetch(`${API_URL}/${editingStudentId}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        course: course,
        gender: gender,
        status: students.find((student) => student.id === editingStudentId)
          .status,
      }),
    });

    // Convert Response into JSON
    const result = await response.json();

    // Check Response
    if (!response.ok) {
      alert(result.message || "Failed to Update Student");
      return;
    }

    alert("Student Updated Successfully!");

    // Reset Editing Mode
    editingStudentId = null;

    // Get Updated Data from Database
    await getStudents();

    // Change Button Text
    document.querySelector("#studentForm button[type='submit']").textContent =
      "Add Student";

      // Hide Cancel Button
cancelEditBtn.hidden = true;

  } else {
    // Send Student Data to Backend
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        course: course,
        gender: gender,
      }),
    });

    // Convert Response into JSON
    const result = await response.json();

    // Check Response
    if (!response.ok) {
      alert(result.message || "Failed to Add Student");
      return;
    }

    alert("Student Added Successfully!");

    // Get Updated Students from Database
    await getStudents();
  }


  // Reset Form
  studentForm.reset();

  // Reset Editing Mode
  editingStudentId = null;

  // Reset Button Text
  document.querySelector("#studentForm button[type='submit']").textContent =
    "Add Student";
});

// EDIT STUDENT

function editStudent(id) {
  // Find Student
  const student = students.find((student) => student.id === id);

  if (!student) {
    return;
  }

  // Fill Form With Student Details
  document.getElementById("studentName").value = student.name;

  document.getElementById("studentEmail").value = student.email || "";

  document.getElementById("studentPhone").value = student.phone || "";

  document.getElementById("studentCourse").value = student.course;

  document.getElementById("studentGender").value = student.gender || "";

  // Store Editing Student ID
  editingStudentId = student.id;

  // Change Button Text
  document.querySelector("#studentForm button[type='submit']").textContent =
    "Update Student";

  document.getElementById("cancelEditBtn").hidden = false;

  // Automatically Open Add Student Page
  showPage("add-student");

  // Scroll To Form
  document.querySelector(".add-student").scrollIntoView({
    behavior: "smooth",
  });
}

// DELETE STUDENT

async function deleteStudent(id) {
  // Confirm Before Delete
  const confirmDelete = confirm(
    "Are you sure you want to delete this student?",
  );

  if (!confirmDelete) {
    return;
  }

  try {
    // Send DELETE Request to Backend
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    // Convert Response into JSON
    const result = await response.json();

    // Check Response
    if (!response.ok) {
      alert(result.message || "Failed to Delete Student");
      return;
    }

    // If Deleted Student Was Being Edited
    if (editingStudentId === id) {
      editingStudentId = null;

      studentForm.reset();

      document.querySelector("#studentForm button[type='submit']").textContent =
        "Add Student";

        cancelEditBtn.hidden = true;
    }

    alert("Student Deleted Successfully!");

    // Get Updated Students from Database
    await getStudents();
  } catch (error) {
    console.log("Delete Error:", error);

    alert("Something went wrong!");
  }
}

// DISPLAY STUDENTS

function displayStudents(filteredStudents = students) {
  const studentTableBody = document.getElementById("studentTableBody");

  // Clear Existing Data
  studentTableBody.innerHTML = "";

  // Loop Through Students
  filteredStudents.forEach(function (student, index) {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${index + 1}</td>

            <td>${student.name}</td>

            <td>${student.email || "—"}</td>

            <td>${student.phone || "—"}</td>

            <td>${student.course}</td>

            <td>
    <select onchange="updateStudentStatus(${student.id}, this.value)">

        <option value="Active" ${student.status === "Active" ? "selected" : ""}>
            Active
        </option>

        <option value="Inactive" ${student.status === "Inactive" ? "selected" : ""}>
            Inactive
        </option>

    </select>
</td>

            <td>
                <button class="edit-btn"
                    onclick="editStudent(${student.id})">
                    Edit
                </button>

                <button class="delete-btn"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            </td>
        `;

    studentTableBody.appendChild(row);
  });

  // Update Student Count
  document.getElementById("studentCount").textContent =
    `${filteredStudents.length} Students`;
}

// Display Students
displayStudents();

// SEARCH AND FILTER STUDENTS

// Get HTML Elements

const searchInput = document.getElementById("searchInput");

const courseFilter = document.getElementById("courseFilter");

const statusFilter = document.getElementById("statusFilter");

// Filter Students Function

function filterStudents() {
  // Get Search Value
  const searchText = searchInput.value.toLowerCase().trim();

  // Get Selected Course
  const selectedCourse = courseFilter.value;

  // Get Selected Status
  const selectedStatus = statusFilter.value;

  // Filter Students
  const filteredStudents = students.filter(function (student) {
    // Search by Name or Email
    const matchesSearch =
      student.name.toLowerCase().includes(searchText) ||
      (student.email || "").toLowerCase().includes(searchText) ||
      (student.phone || "").toLowerCase().includes(searchText) ||
      (student.course || "").toLowerCase().includes(searchText);

    // Filter by Course
    const matchesCourse =
      selectedCourse === "" || student.course === selectedCourse;

    // Filter by Status
    const matchesStatus =
      selectedStatus === "" || student.status === selectedStatus;

    // All Conditions Must Match
    return matchesSearch && matchesCourse && matchesStatus;
  });

  // Sort Students
  const sortValue = document.getElementById("sortStudents").value;

  if (sortValue === "az") {
    filteredStudents.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  } else if (sortValue === "za") {
    filteredStudents.sort(function (a, b) {
      return b.name.localeCompare(a.name);
    });
  }
  // Display Filtered Students
  displayStudents(filteredStudents);
}

// Search Event
searchInput.addEventListener("input", filterStudents);

// Course Filter Event
courseFilter.addEventListener("change", filterStudents);

// Status Filter Event
statusFilter.addEventListener("change", filterStudents);

// Sort Students Event
document
  .getElementById("sortStudents")
  .addEventListener("change", filterStudents);

// SIDEBAR NAVIGATION

// Get All Sidebar Menu Items
const menuItems = document.querySelectorAll(".menu-item");

// Get All Page Sections
const pageSections = document.querySelectorAll(".page-section");

// Get Navbar Heading
const pageTitle = document.querySelector(".navbar h2");

function showPage(pageId) {
  pageSections.forEach(function (section) {
    section.hidden = true;
  });

  const selectedSection = document.getElementById(pageId);

  if (!selectedSection) return;

  selectedSection.hidden = false;

  menuItems.forEach(function (item) {
    item.classList.remove("active");
  });

  const activeMenu = document.querySelector(
    `.menu-item[data-page="${pageId}"]`,
  );

  if (activeMenu) {
    activeMenu.classList.add("active");
  }

  if (pageTitle) {
    pageTitle.textContent = activeMenu
      ? activeMenu.textContent.trim()
      : "Dashboard";
  }
}

// Add Click Event to Sidebar Menu
menuItems.forEach(function (item) {
  item.addEventListener("click", function (event) {
    event.preventDefault();

    const pageId = item.dataset.page;

    showPage(pageId);
  });
});

// DISPLAY COURSES

function displayCourses() {
  // Get Courses Container
  const coursesContainer = document.getElementById("coursesContainer");

  // Get Unique Courses From Students
  const courses = [...new Set(students.map((student) => student.course))];

  // Clear Previous Courses
  coursesContainer.innerHTML = "";

  // Update Course Count
  document.getElementById("courseCount").textContent =
    `${courses.length} Courses`;

  // Display Every Course
  courses.forEach(function (course) {
    // Count Students in This Course
    const totalStudents = students.filter(
      (student) => student.course === course,
    ).length;

    // Create Course Card
    const courseCard = document.createElement("div");

    courseCard.className = "card course-card";

    courseCard.innerHTML = `
            <h3>${course}</h3>
            <p>${totalStudents} Students Enrolled</p>
        `;

    // Add Card to Container
    coursesContainer.appendChild(courseCard);
  });
}

// DARK MODE SETTINGS

const darkModeToggle = document.getElementById("darkModeToggle");

// Apply Saved Theme
const savedTheme = localStorage.getItem("darkMode");

if (savedTheme === "enabled") {
  document.body.classList.add("dark-mode");
  darkModeToggle.checked = true;
}

// Change Theme
darkModeToggle.addEventListener("change", function () {
  if (darkModeToggle.checked) {
    document.body.classList.add("dark-mode");

    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark-mode");

    localStorage.setItem("darkMode", "disabled");
  }
});

// ADMIN PROFILE DROPDOWN

const adminProfile = document.getElementById("adminProfile");

const profileDropdown = document.getElementById("profileDropdown");

// Open / Close Dropdown
adminProfile.addEventListener("click", function (event) {
  event.stopPropagation();

  profileDropdown.hidden = !profileDropdown.hidden;
});

// Close Dropdown When Clicking Outside
document.addEventListener("click", function () {
  profileDropdown.hidden = true;
});

// Settings Button
document
  .getElementById("settingsBtn")
  .addEventListener("click", function (event) {
    event.stopPropagation();

    profileDropdown.hidden = true;

    showPage("settings");
  });

// Logout Button
document
  .getElementById("logoutBtn")
  .addEventListener("click", function (event) {
    event.stopPropagation();

    alert("Logout functionality will be added later.");
  });

// UPDATE STUDENT STATUS

async function updateStudentStatus(id, newStatus) {
  try {
    // Find Student
    const student = students.find((student) => student.id === id);

    if (!student) {
      alert("Student Not Found!");
      return;
    }

    // Update Status in Backend
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: student.name,
        email: student.email,
        phone: student.phone,
        course: student.course,
        gender: student.gender,
        status: newStatus,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Status Update Failed!");
      return;
    }

    alert("Student Status Updated Successfully!");

    // Refresh Student Data
    await getStudents();
  } catch (error) {
    console.log("Status Update Error:", error);

    alert("Something Went Wrong!");
  }
}

const cancelEditBtn = document.getElementById("cancelEditBtn");

cancelEditBtn.addEventListener("click", function () {
  studentForm.reset();

  editingStudentId = null;

  document.querySelector("#studentForm button[type='submit']").textContent =
    "Add Student";

  cancelEditBtn.hidden = true;
});

// Open Dashboard By Default
showPage("dashboard");
