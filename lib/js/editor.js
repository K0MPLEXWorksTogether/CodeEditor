// Retrieve Elements
const consoleLogList = document.querySelector('.editor__console-logs');
const executeCodeBtn = document.querySelector('.editor__run');
const resetCodeBtn = document.querySelector('.editor__reset');
const languageSelector = document.getElementById('languageSelector'); // Added selector retrieval

// Setup Ace
let codeEditor = ace.edit("editorCode");
let defaultCode = 'console.log("Hello World!")';
let consoleMessages = [];

let editorLib = {
    clearConsoleScreen() {
        consoleMessages.length = 0;

        // Remove all elements in the log list
        while (consoleLogList.firstChild) {
            consoleLogList.removeChild(consoleLogList.firstChild);
        }
    },
    printToConsole() {
        consoleMessages.forEach(log => {
            const newLogItem = document.createElement('li');
            const newLogText = document.createElement('pre');

            newLogText.className = log.class;
            newLogText.textContent = `> ${log.message}`;

            newLogItem.appendChild(newLogText);
            consoleLogList.appendChild(newLogItem);
        });
    },
    init() {
        // Configure Ace

        // Theme
        codeEditor.setTheme("ace/theme/dreamweaver");

        // Set language
        codeEditor.session.setMode("ace/mode/javascript");

        // Set Options
        codeEditor.setOptions({
            fontFamily: 'Inconsolata',
            fontSize: '12pt',
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
        });

        // Set Default Code
        codeEditor.setValue(defaultCode);
    }
};

function updateEditorMode(language) {
    const modeMap = {
        javascript: "ace/mode/javascript",
        python: "ace/mode/python",
        java: "ace/mode/java",
        c: "ace/mode/c_cpp",
        cpp: "ace/mode/c_cpp",
    };
    const selectedMode = modeMap[language] || "ace/mode/javascript";

    // Set the editor's mode to the selected language
    codeEditor.session.setMode(selectedMode);
}

// Event listener for language selection
languageSelector.addEventListener("change", (e) => {
    updateEditorMode(e.target.value);
});

// Event for the reset button
resetCodeBtn.addEventListener('click', () => {
    // Clear ace editor
    codeEditor.setValue(defaultCode);

    // Clear console messages
    editorLib.clearConsoleScreen();
});

// Initialize the editor
editorLib.init();
