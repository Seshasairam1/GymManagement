const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchEmail");
const form = document.getElementById("editForm");

searchBtn.addEventListener("click", async () => {
  const email = searchInput.value.trim().toLowerCase();
  if (!email) return alert("Please enter an email.");

  try {
    const response = await fetch(`http://localhost:3000/user/${email}`);
    if (!response.ok) {
      return alert("User not found.");
    }

    const user = await response.json();

    form.style.display = "block";

    form.elements["id"].value = user._id;
    form.elements["name"].value = user.name;
    form.elements["phone"].value = user.phone;
    form.elements["age"].value = user.age;
    form.elements["health"].value = user.health || "";
    form.elements["membership"].value = user.membership;
    form.elements["trainer"].value = user.trainer;

  } catch (error) {
    console.error("Fetch error:", error);
    alert("Failed to fetch user.");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = form.elements["id"].value;
  const updatedData = {
    name: form.elements["name"].value,
    phone: form.elements["phone"].value,
    age: form.elements["age"].value,
    health: form.elements["health"].value,
    membership: form.elements["membership"].value,
    trainer: form.elements["trainer"].value
  };

  try {
    const response = await fetch(`http://localhost:3000/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });

    const result = await response.json();
    alert(result.message);
  } catch (error) {
    console.error("Update error:", error);
    alert("Failed to update user.");
  }
});
