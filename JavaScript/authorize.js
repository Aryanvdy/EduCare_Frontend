const there = localStorage.getItem("token");
if (!there) {
  location.href = "/index.html";
}
