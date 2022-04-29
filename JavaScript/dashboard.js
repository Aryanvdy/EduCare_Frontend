const token = "Bearer " + localStorage.getItem("token");
const cards = document.querySelector("#unique-card");
const classList = document.querySelector("#class-selected");

const getClasses = async () => {
  const getClass = await fetch(
    "https://educare-backend-api.herokuapp.com/api/v1/teacher/class",
    {
      method: "GET",
      headers: {
        authorization: token,
        Accept: "application/json",
      },
    }
  );

  const json = await getClass.json();
  console.log(json);
  if (json.status.message == "fail" || json.status.message == "error") {
    console.log("There was an error");
  } else {
    const classe = json.data.classes;
    for (let i = 0; i < classe.length; i++) {
      classList.innerHTML += `<option value="${classe[i]._id}">${classe[i].name}</option>`;
    }
  }
};
const getSubjects = async () => {
  const getSubject = await fetch(
    "https://educare-backend-api.herokuapp.com/api/v1/subject",
    {
      method: "GET",
      headers: {
        authorization: token,
        Accept: "application/json",
      },
    }
  );

  const json = await getSubject.json();
  console.log(json);
  if (json.status.message == "fail" || json.status.message == "error") {
    console.log("There was an error");
  } else {
    const subjext = json.data.subjects;
    console.log(subjext.length);

    for (let i = 0; i < subjext.length; i++) {
      cards.innerHTML += `<a href="/class.html?id=${subjext[i]._id}" class="card">
        <h1 class="subject">${subjext[i].name}</h1>
        <h3 class="batch">${subjext[i].class.name}</h3> </a
      >`;
    }
  }
};

getSubjects();
getClasses();

const classAdd = document.querySelector(".class-add");
console.log(classAdd);

classAdd.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.querySelector("#students-csv");
  const className = classAdd["class-name"].value;
  const formData = new FormData();
  formData.append("file", file.files[0]);
  formData.append("name", className);

  const addClass = await fetch(
    "https://educare-backend-api.herokuapp.com/api/v1/teacher/class",
    {
      method: "POST",
      headers: {
        authorization: token,
      },
      body: formData,
    }
  );

  const classDetails = await addClass.json();
  console.log(classDetails);
  if (
    classDetails.status.message !== "error" &&
    classDetails.status.message !== "fail" &&
    classDetails.error.length == 0
  ) {
    location.href = "./dashboard.html";
  } else {
    document.querySelector("#class-error").innerHTML = classDetails.message;
  }
});

const subjectAdd = document.querySelector(".subject-add");
subjectAdd.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = subjectAdd["subject-name"].value;
  const Class = subjectAdd["class-selected"].value;
  console.log(name, Class);
  const addSubject = await fetch(
    "https://educare-backend-api.herokuapp.com/api/v1/subject",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({
        name,
        class: Class,
      }),
    }
  );

  const subject = await addSubject.json();
  if (subject.status.message !== "error" && subject.status.message !== "fail") {
    location.href = "./dashboard.html";
  } else {
    document.querySelector("#subject-error").innerHTML = subject.message;
  }
});
console.log(subjectAdd);
