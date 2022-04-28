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
