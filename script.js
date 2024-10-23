document.addEventListener('DOMContentLoaded', function() {
    // Get all buttons with the class 'show-description'
    const buttons = document.querySelectorAll('.show-description');

    // Add a click event listener to each button
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the data-file attribute which contains the file name
            const fileName = this.getAttribute('data-file');
            const descriptionDiv = this.nextElementSibling; // The div where the description will be shown

            // Use fetch to load the text file
            fetch(fileName)
                .then(response => response.text())  // Convert the response to text
                .then(data => {
                    // Split the text file content by lines
                    const lines = data.split('\n');
                    let projectName = '', imageUrl = '', summary = '', description = '';
                    
                    // Parse the lines to extract the image, project name, summary, and description
                    lines.forEach(line => {
                        if (line.startsWith('Project Name:')) {
                            projectName = line.replace('Project Name:', '').trim();
                        } else if (line.startsWith('Image:')) {
                            imageUrl = line.replace('Image:', '').trim();
                        } else if (line.startsWith('Summary:')) {
                            summary = line.replace('Summary:', '').trim();
                        } else if (line.startsWith('Description:')) {
                            description = line.replace('Description:', '').trim();
                        }
                    });

                    // Create HTML to display project details in row layout
                    const contentHtml = `
                        <div class="project-row">
                            <img src="${imageUrl}" alt="${projectName}" class="project-image">
                            <div class="project-info">
                                <h4>${projectName}</h4>
                                <p><strong>Summary:</strong> ${summary}</p>
                                <p><strong>Description:</strong> ${description}</p>
                            </div>
                        </div>
                    `;

                    // Set the description div's HTML to the generated content
                    descriptionDiv.innerHTML = contentHtml;
                })
                .catch(error => {
                    // In case of an error, display a message
                    descriptionDiv.textContent = "Error loading project description.";
                    console.error("Error loading project file:", error);
                });
        });
    });
});
