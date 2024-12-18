document.getElementById("sortButton").addEventListener("click", function() {
    var dropdown = document.getElementById("dropdown");
    
    // Toggle the dropdown visibility
    if (dropdown.style.display === "none" || dropdown.style.display === "") {
      dropdown.style.display = "block";
    } else {
      dropdown.style.display = "none";
    }
  });
  
  // Close the dropdown if the user clicks outside of it
  window.addEventListener("click", function(event) {
    if (!event.target.matches('#sortButton')) {
      var dropdown = document.getElementById("dropdown");
      if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
      }
    }
  });