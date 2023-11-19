document.addEventListener('DOMContentLoaded', function () {
    // Function to update the text of the label to the name of the file
    function showFileName(event) {
      let input = event.target;
      let fileName = input.files[0].name;
      let label = input.nextElementSibling;
      label.textContent = fileName;
    }
  
    // Add event listeners to file inputs
    let fileInputs = document.querySelectorAll('.inputfile');
    fileInputs.forEach(input => {
      input.addEventListener('change', showFileName);
    });
  
    // Existing form submission code
    document.getElementById('uploadForm').onsubmit = function(event) {
      event.preventDefault();
      let formData = new FormData(event.target);
      
      fetch('/check-plagiarism', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        document.getElementById('result').innerHTML = `<strong>Plagiarism Percentage:</strong> ${data.plagiarismPercentage}%`;
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };
  });
  