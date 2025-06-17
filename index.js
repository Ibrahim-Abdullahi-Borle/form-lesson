document.getElementById("userForm").addEventListener("submit", function (e) {
  e.preventDefault();
});

const userData = {
  name: document.getElementById("name").value,
  email: document.getElementById("email").value,
  phone: document.getElementById("phone").value,
  message: document.getElementById("message").value,
};

// we are sending data to the server
fetch("http//localhost:3000/users", {
    // means we are sending data to the server
    method: "POST",
    // tells that we are sending JSON data
    headers: {
        "content-Type": "application/json",
    },
    // converts object to json
    body: JSON.stringify(userData),
})