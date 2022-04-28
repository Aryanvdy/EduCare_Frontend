const form = document.querySelector(".login-form");
const signupLink = document.querySelector(".signup_link");
console.log(form);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;
  //   console.log(form.email.value);
  //   console.log(form.password.value);
  console.log(email);
  console.log("Submit button dabaya hai");

  const response = await fetch(
    "https://educare-backend-api.herokuapp.com/api/v1/auth/login",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,

        password,
      }),
    }
  );

  const json = await response.json();
  console.log(json);

  if (json.status?.message === "fail" || json.status?.message === "error") {
    signupLink.textContent = "Invalid Credentials";
  } else {
    localStorage.setItem("token", json.data.token);
    location.href = "./dashboard.html";
  }
});
