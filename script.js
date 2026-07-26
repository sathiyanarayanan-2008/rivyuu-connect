// Student Management Dashboard
// Handles CRUD operations, validation, filtering, and localStorage persistence.

(function studentDashboard() {
  const STORAGE_KEY = "studentDashboardData";
  const INIT_FLAG_KEY = "studentDashboardInitialized";

  const studentForm = document.getElementById("studentForm");
  const formTitle = document.getElementById("formTitle");
  const editIndexInput = document.getElementById("editIndex");

  const nameInput = document.getElementById("name");
  const registerInput = document.getElementById("registerNumber");
  const departmentInput = document.getElementById("department");
  const yearInput = document.getElementById("year");
  const marksInput = document.getElementById("marks");

  const addBtn = document.getElementById("addBtn");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  const searchInput = document.getElementById("searchInput");
  const filterDepartmentInput = document.getElementById("filterDepartment");
  const filterYearInput = document.getElementById("filterYear");
  const sortByInput = document.getElementById("sortBy");
  const exportCsvBtn = document.getElementById("exportCsvBtn");
  const importCsvBtn = document.getElementById("importCsvBtn");
  const importCsvInput = document.getElementById("importCsvInput");
  const studentTableBody = document.getElementById("studentTableBody");
  const emptyState = document.getElementById("emptyState");
  const toast = document.getElementById("toast");

  const errorEls = {
    name: document.getElementById("nameError"),
    registerNumber: document.getElementById("registerError"),
    department: document.getElementById("departmentError"),
    year: document.getElementById("yearError"),
    marks: document.getElementById("marksError")
  };

  let students = [];

  function seedDummyData() {
    const isInitialized = localStorage.getItem(INIT_FLAG_KEY);
    if (isInitialized) {
      return;
    }

    const sample = [
      {
        name: "Aarav Sharma",
        registerNumber: "REG2026001",
        department: "Computer Science",
        year: "2",
        marks: "86"
      },
      {
        name: "Meera Iyer",
        registerNumber: "REG2026002",
        department: "Electronics",
        year: "3",
        marks: "91"
      },
      {
        name: "Rahul Nair",
        registerNumber: "REG2026003",
        department: "Mechanical",
        year: "1",
        marks: "78"
      }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
    localStorage.setItem(INIT_FLAG_KEY, "true");
  }

  function loadStudents() {
    const raw = localStorage.getItem(STORAGE_KEY);
    students = raw ? JSON.parse(raw) : [];
  }

  function saveStudents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }

  function normalize(text) {
    return String(text || "").trim().toLowerCase();
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.remove("hidden");

    clearTimeout(showToast.timerId);
    showToast.timerId = setTimeout(() => {
      toast.classList.add("hidden");
    }, 2000);
  }

  function clearErrors() {
    Object.values(errorEls).forEach((el) => {
      el.textContent = "";
    });
  }

  function validateForm(payload, currentEditIndex) {
    clearErrors();
    let isValid = true;

    if (!payload.name) {
      errorEls.name.textContent = "Name is required.";
      isValid = false;
    } else if (payload.name.length < 2) {
      errorEls.name.textContent = "Name must be at least 2 characters.";
      isValid = false;
    }

    if (!payload.registerNumber) {
      errorEls.registerNumber.textContent = "Register number is required.";
      isValid = false;
    }

    if (!payload.department) {
      errorEls.department.textContent = "Department is required.";
      isValid = false;
    }

    if (!payload.year) {
      errorEls.year.textContent = "Please select year.";
      isValid = false;
    }

    const marks = Number(payload.marks);
    if (payload.marks === "") {
      errorEls.marks.textContent = "Marks are required.";
      isValid = false;
    } else if (Number.isNaN(marks) || marks < 0 || marks > 100) {
      errorEls.marks.textContent = "Marks must be between 0 and 100.";
      isValid = false;
    }

    // Prevent duplicate register numbers. During edit, allow same index.
    const duplicateIndex = students.findIndex(
      (student) => normalize(student.registerNumber) === normalize(payload.registerNumber)
    );

    if (
      duplicateIndex !== -1 &&
      (currentEditIndex === null || duplicateIndex !== currentEditIndex)
    ) {
      errorEls.registerNumber.textContent = "Register number already exists.";
      isValid = false;
    }

    return isValid;
  }

  function getFormData() {
    return {
      name: nameInput.value.trim(),
      registerNumber: registerInput.value.trim(),
      department: departmentInput.value.trim(),
      year: yearInput.value,
      marks: marksInput.value.trim()
    };
  }

  function resetForm() {
    studentForm.reset();
    editIndexInput.value = "";
    formTitle.textContent = "Add Student";
    addBtn.classList.remove("hidden");
    saveBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    clearErrors();
  }

  function updateDepartmentFilterOptions() {
    const previous = filterDepartmentInput.value;
    const departments = [...new Set(students.map((student) => student.department.trim()))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    filterDepartmentInput.innerHTML = '<option value="">All Departments</option>';
    departments.forEach((department) => {
      const option = document.createElement("option");
      option.value = department;
      option.textContent = department;
      filterDepartmentInput.appendChild(option);
    });

    if (departments.includes(previous)) {
      filterDepartmentInput.value = previous;
    }
  }

  function enterEditMode(index) {
    const student = students[index];
    if (!student) {
      return;
    }

    nameInput.value = student.name;
    registerInput.value = student.registerNumber;
    departmentInput.value = student.department;
    yearInput.value = student.year;
    marksInput.value = student.marks;
    editIndexInput.value = String(index);

    formTitle.textContent = "Edit Student";
    addBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
    clearErrors();
    nameInput.focus();
  }

  function getVisibleStudents() {
    const query = normalize(searchInput.value);
    const selectedDepartment = filterDepartmentInput.value;
    const selectedYear = filterYearInput.value;
    const sortBy = sortByInput.value;

    const visibleStudents = students
      .map((student, index) => ({ ...student, index }))
      .filter((student) => {
        if (selectedDepartment && student.department !== selectedDepartment) {
          return false;
        }

        if (selectedYear && student.year !== selectedYear) {
          return false;
        }

        if (!query) {
          return true;
        }

        return [student.name, student.registerNumber, student.department, student.year, student.marks]
          .some((field) => normalize(field).includes(query));
      });

    visibleStudents.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "marks-asc":
          return Number(a.marks) - Number(b.marks);
        case "marks-desc":
          return Number(b.marks) - Number(a.marks);
        case "year-asc":
          return Number(a.year) - Number(b.year);
        case "year-desc":
          return Number(b.year) - Number(a.year);
        default:
          return 0;
      }
    });

    return visibleStudents;
  }

  function renderTable() {
    const visibleStudents = getVisibleStudents();
    studentTableBody.innerHTML = "";

    if (!visibleStudents.length) {
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    visibleStudents.forEach((student) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(student.name)}</td>
        <td>${escapeHtml(student.registerNumber)}</td>
        <td>${escapeHtml(student.department)}</td>
        <td>${escapeHtml(student.year)}</td>
        <td>${escapeHtml(student.marks)}</td>
        <td class="actions">
          <button class="btn btn-edit" data-action="edit" data-index="${student.index}">Edit</button>
          <button class="btn btn-danger" data-action="delete" data-index="${student.index}">Delete</button>
        </td>
      `;
      studentTableBody.appendChild(row);
    });
  }

  function addStudent(event) {
    event.preventDefault();
    const payload = getFormData();

    if (!validateForm(payload, null)) {
      return;
    }

    students.push(payload);
    saveStudents();
    updateDepartmentFilterOptions();
    renderTable();
    resetForm();
    showToast("Student added successfully.");
  }

  function saveEditedStudent() {
    const editIndex = Number(editIndexInput.value);
    if (Number.isNaN(editIndex) || !students[editIndex]) {
      resetForm();
      return;
    }

    const payload = getFormData();
    if (!validateForm(payload, editIndex)) {
      return;
    }

    students[editIndex] = payload;
    saveStudents();
    updateDepartmentFilterOptions();
    renderTable();
    resetForm();
    showToast("Student updated successfully.");
  }

  function deleteStudent(index) {
    const student = students[index];
    if (!student) {
      return;
    }

    const ok = window.confirm(
      `Are you sure you want to delete record for ${student.name} (${student.registerNumber})?`
    );

    if (!ok) {
      return;
    }

    students.splice(index, 1);
    saveStudents();
    updateDepartmentFilterOptions();
    renderTable();
    showToast("Student deleted successfully.");
  }

  function toCsvValue(value) {
    const text = String(value ?? "");
    const escaped = text.replace(/"/g, "\"\"");
    return `"${escaped}"`;
  }

  function buildCsv(studentsList) {
    const header = ["Name", "Register Number", "Department", "Year", "Marks"];
    const rows = studentsList.map((student) => ([
      student.name,
      student.registerNumber,
      student.department,
      student.year,
      student.marks
    ].map(toCsvValue).join(",")));

    return [header.join(","), ...rows].join("\n");
  }

  function exportCsv() {
    const csvText = buildCsv(students);
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateSuffix = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `student-records-${dateSuffix}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("CSV exported successfully.");
  }

  function parseCsvLine(line) {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"' && inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values;
  }

  function importCsvFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

        if (lines.length < 2) {
          showToast("CSV file has no student records.");
          importCsvInput.value = "";
          return;
        }

        const imported = [];
        const registerSet = new Set(students.map((s) => normalize(s.registerNumber)));

        // Skip header row; import only valid and non-duplicate records.
        for (let i = 1; i < lines.length; i += 1) {
          const cols = parseCsvLine(lines[i]);
          if (cols.length < 5) {
            continue;
          }

          const payload = {
            name: cols[0].replace(/^"|"$/g, "").trim(),
            registerNumber: cols[1].replace(/^"|"$/g, "").trim(),
            department: cols[2].replace(/^"|"$/g, "").trim(),
            year: cols[3].replace(/^"|"$/g, "").trim(),
            marks: cols[4].replace(/^"|"$/g, "").trim()
          };

          if (!payload.name || !payload.registerNumber || !payload.department || !payload.year) {
            continue;
          }

          const marks = Number(payload.marks);
          if (Number.isNaN(marks) || marks < 0 || marks > 100) {
            continue;
          }

          const registerKey = normalize(payload.registerNumber);
          if (registerSet.has(registerKey)) {
            continue;
          }

          registerSet.add(registerKey);
          imported.push(payload);
        }

        if (!imported.length) {
          showToast("No valid new records to import.");
          importCsvInput.value = "";
          return;
        }

        students.push(...imported);
        saveStudents();
        updateDepartmentFilterOptions();
        renderTable();
        showToast(`Imported ${imported.length} student record(s).`);
      } catch (error) {
        showToast("Failed to import CSV.");
      } finally {
        importCsvInput.value = "";
      }
    };

    reader.readAsText(file);
  }

  function onTableClick(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }

    const action = button.dataset.action;
    const index = Number(button.dataset.index);

    if (Number.isNaN(index)) {
      return;
    }

    if (action === "edit") {
      enterEditMode(index);
    } else if (action === "delete") {
      deleteStudent(index);
    }
  }

  function init() {
    seedDummyData();
    loadStudents();
    updateDepartmentFilterOptions();
    renderTable();

    studentForm.addEventListener("submit", addStudent);
    saveBtn.addEventListener("click", saveEditedStudent);
    cancelBtn.addEventListener("click", resetForm);
    searchInput.addEventListener("input", renderTable);
    filterDepartmentInput.addEventListener("change", renderTable);
    filterYearInput.addEventListener("change", renderTable);
    sortByInput.addEventListener("change", renderTable);
    exportCsvBtn.addEventListener("click", exportCsv);
    importCsvBtn.addEventListener("click", () => importCsvInput.click());
    importCsvInput.addEventListener("change", importCsvFile);
    studentTableBody.addEventListener("click", onTableClick);
  }

  init();
})();
