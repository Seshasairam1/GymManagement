document.getElementById("registrationForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
  
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
      alert(result.message);
  
      if (response.ok) {
        this.reset();
      }
    } catch (error) {
      alert("Something went wrong while submitting the form.");
    }
  });
  
