const tbody = document.querySelector("#userTable tbody");

async function fetchUsers() {
  try {
    const res = await fetch("http://localhost:3000/users");
    const users = await res.json();

    tbody.innerHTML = "";

    users.forEach(user => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.age}</td>
        <td>${user.health || "-"}</td>
        <td>${user.membership}</td>
        <td>${user.trainer}</td>
        <td><button class="delete-btn" onclick="deleteUser('${user._id}')">Delete</button></td>
      `;

      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error loading users:", error);
  }
}

async function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await fetch(`http://localhost:3000/delete/${id}`, {
      method: "DELETE"
    });

    const result = await res.json();
    alert(result.message);
    fetchUsers(); // refresh table
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete user.");
  }
}

fetchUsers();
