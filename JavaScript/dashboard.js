const token = "Bearer " + localStorage.getItem("token");
const cards = document.querySelector("#unique-card");
const classList = document.querySelector("#classList");

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
