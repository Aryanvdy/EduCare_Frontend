const urlString = window.location.search;
const token = "Bearer " + localStorage.getItem("token");
const participants = document.querySelector(".part");
const classL = document.querySelector(".class-l");
const subjectL = document.querySelector(".subject-l");
const form = document.querySelector("#assignment-submit");

console.log(urlString);

const urlParams = new URLSearchParams(urlString);
console.log(urlParams.get("id"));
const id = urlParams.get("id");

const getSubjectById = async (id) => {
  const getSubject = await fetch(
    `https://educare-backend-api.herokuapp.com/api/v1/subject/${id}`,
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
  if (json.status.message == "fail" || json.status.message == "fail") {
    console.log("something went wrong");
  } else {
    subjectL.textContent = json.data.subject.name;
    classL.textContent = json.data.subject.class.name;
    for (let i = 0; i < json.data.subject.class.students.length; i++) {
      participants.innerHTML += `<p class="participants">${
        json.data.subject.class.students[i].name.first +
        " " +
        json.data.subject.class.students[i].name.last
      }</p>`;
    }
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.querySelector(".iddd");
  console.log(form.name.value);
  console.log(form.description.value);
  console.log(form.dueDate.value);
  //   console.log(form.name.value);
  const formData = new FormData();
  formData.append("file", file.files[0]);
  formData.append("name", form.name.value);
  formData.append("description", form.description.value);
  formData.append("dueDate", form.dueDate.value);
  formData.append("subject", id);
  console.log(formData);
  const uploadAss = await fetch(
    "https://educare-backend-api.herokuapp.com/api/v1/assignment",
    {
      method: "POST",
      headers: {
        authorization: token,
      },
      body: formData,
    }
  );
  const json = await uploadAss.json();
  console.log(json);
});

getSubjectById(id);

const scheduleAdd = document.querySelector("#schedule-form-submit");
scheduleAdd.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(scheduleAdd["schedule-description"].value);
  console.log(scheduleAdd["schedule-start-date"].value);
  console.log(scheduleAdd["schedule-end-date"].value);
  console.log(scheduleAdd["schedule-link"].value);

  const description = scheduleAdd["schedule-description"].value;
  const startTime = scheduleAdd["schedule-start-date"].value;
  const endTime = scheduleAdd["schedule-end-date"].value;
  const link = scheduleAdd["schedule-link"].value;

  console.log({
    description,
    startTime,
    endTime,
    link,
    subject: id,
  });
  const addSchedule = await fetch(
    "https://educare-backend-api.herokuapp.com/api/v1/schedule",
    {
      method: "POST",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        startTime,
        endTime,
        link,
        subject: id,
      }),
    }
  );

  const response = await addSchedule.json();
  if (response.status.message == "success") {
    location.href = `./class.html?id=${id}`;
  } else {
    document.querySelector(".schedule-error").innerHTML = response.message;
  }
  console.log(response);
});
