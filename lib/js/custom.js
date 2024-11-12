// Function to get editor content and selected language, and execute the code via Piston API
async function executeCode() {
    const editorContentDiv = document.querySelector('.ace_content');
    const languageSelector = document.querySelector('.editor__selector');
    const runButton = document.querySelector('.editor__run');

    if (!editorContentDiv || !languageSelector || !runButton) {
        console.error('Required elements not found');
        return;
    }

    // Get the code from the editor
    const code = editorContentDiv.innerText.trim();
    const language = languageSelector.value;

    // Check if the code is empty
    if (code === '') {
        displayConsoleOutput('No code to execute', 'error');
        return;
    }

    // Add loading spinner
    const loadingSpinner = document.createElement('span');
    loadingSpinner.classList.add('loading-spinner');
    loadingSpinner.textContent = '⏳';
    runButton.after(loadingSpinner);

    try {
        // Make a request to Piston API to execute the code
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                language: language,
                version: '*',  // Using '*' to choose the latest version
                files: [{ content: code }]
            })
        });

        const result = await response.json();
        const output = result.run.output || 'Execution completed with no output';

        // Display the output
        displayConsoleOutput(output, result.run.stderr ? 'error' : 'success');
    } catch (error) {
        displayConsoleOutput('Error executing code', 'error');
        console.error('Error executing code:', error);
    } finally {
        // Remove loading spinner
        loadingSpinner.remove();
    }
}

// Function to display output in the editor's console window
function displayConsoleOutput(output, type = 'success') {
    const consoleLogs = document.querySelector('.editor__console-logs');
    if (consoleLogs) {
        // Clear previous logs
        consoleLogs.innerHTML = '';

        // Create and append the new log item
        const logItem = document.createElement('li');
        logItem.textContent = output;

        // Apply styles based on the type of message
        if (type === 'error') {
            logItem.style.color = 'red';
        }

        consoleLogs.appendChild(logItem);
    } else {
        console.error('Console element not found');
    }
}

// Add event listener to the button with class 'editor__run'
document.addEventListener('DOMContentLoaded', () => {
    const runButton = document.querySelector('.editor__run');
    if (runButton) {
        runButton.addEventListener('click', executeCode);
    } else {
        console.error('Run button not found');
    }
});
