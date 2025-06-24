document
        .getElementById("userForm")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const userData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            message: document.getElementById("message").value,
          }
          fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          })
            .then((res) => res.json())
            .then((data) => {
              document.getElementById("responseMsg").textContent =
                "Data submitted successfully!";
              document.getElementById("userForm").reset();
            })
            .catch((err) => {
              document.getElementById("responseMsg").textContent =
                "Submission failed!";
              console.error(err);
           });
          });