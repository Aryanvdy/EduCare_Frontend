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
    subjectL.textContent = json.data.subject.class.name;
    classL.textContent = json.data.subject.name;
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
  if (json.status.message == "success") {
    location.href = `./class.html?id=${id}`;
  } else {
    console.log("aayaa");
    document.querySelector(".assignment-error").textContent = json.message;
  }
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

const getAssignments = async (id) => {
  const response = await fetch(
    `https://educare-backend-api.herokuapp.com/api/v1/assignment/${id}?limit=100&page=1`,
    {
      method: "GET",
      headers: {
        authorization: token,
        Accept: "application/json",
      },
    }
  );

  const assignments = await response.json();
  if (assignments.status.message == "success") {
    const res = assignments.data.assignments;
    const length = res.length;
    const assignmentSection = document.querySelector(".assignment-data");
    for (let i = 0; i < length; i++) {
      assignmentSection.innerHTML += `<a href="${res[i].pdfReference}">
      <div class="assigncard">
        <span class="Title">Name: ${res[i].name}</span>
        <span class="turnedIn">Assigned to ${
          res[i].students.length
        } students</span>
        <span class="DueDate">Due Date: ${new Date(
          res[i].dueDate
        ).toLocaleDateString()}</span>
      </div>
    </a>`;
    }
  }
};

const getSchedules = async (id) => {
  const response = await fetch(
    `https://educare-backend-api.herokuapp.com/api/v1/schedule/${id}`,
    {
      method: "GET",
      headers: {
        authorization: token,
        Accept: "application/json",
      },
    }
  );

  const schedules = await response.json();
  /*
  <li class="cd-schedule__group">
    <div class="cd-schedule__top-info"><span>Monday</span></div>

    <ul>
      <li class="cd-schedule__event">
        <a
          data-start="aa"
          data-end="10:30"
          data-content="event-abs-circuit"
          data-event="event-1"
          href="#0"
        >
          <em class="cd-schedule__name">Abs Circuit</em>
        </a>
      </li>

      <li class="cd-schedule__event">
        <a
          data-start="11:00"
          data-end="12:30"
          data-content="event-rowing-workout"
          data-event="event-2"
          href="#0"
        >
          <em class="cd-schedule__name">Rowing Workout</em>
        </a>
      </li>

      <li class="cd-schedule__event">
        <a
          data-start="14:00"
          data-end="15:15"
          data-content="event-yoga-1"
          data-event="event-3"
          href="#0"
        >
          <em class="cd-schedule__name">Yoga Level 1</em>
        </a>
      </li>
    </ul>
  </li>
  */
  const scheduleAdding = document.querySelector(".schedule-add");
  if (schedules.schedules.length >= 0) {
    let innerLi = ``;
    for (let i = 0; i < schedules.schedules.length; i++) {
      const curr = schedules.schedules[i]; //
      const startsAt = curr.startsAt;
      innerLi += `<li class="cd-schedule__group">
      <div class="cd-schedule__top-info"><span>${startsAt}</span></div>`;
      let ul = `<ul>`;
      for (let j = curr.schedule.length - 1; j >= 0; j--) {
        const currr = curr.schedule[j];
        ul += `<li class="cd-schedule__event" style="background-color: #111633;" >
        <a
          data-start="${new Date(currr.startTime).getHours()}.${new Date(
          currr.startTime
        ).getMinutes()}"
          data-end="${new Date(currr.endTime).getHours()}.${new Date(
          currr.endTime
        ).getMinutes()}"
          data-content="${currr.description}"
          data-event="${currr.link}"
          href="#0"
        >
          <em class="cd-schedule__name">${currr.description}</em>
        </a>
      </li>
      `;
      }
      ul += `</ul></li>`;
      innerLi += ul;
    }
    scheduleAdding.innerHTML += innerLi;
  }
  // scheduleAdding.innerHTML += "</ul>";
  console.log(schedules);
};

getAssignments(id);
getSchedules(id);
