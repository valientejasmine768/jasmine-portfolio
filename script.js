const themeToggle = document.getElementById("themeToggle");

// Dark and light mode
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    const isLight = document.body.classList.contains("light-mode");
    themeToggle.textContent = isLight ? "☀" : "☾";
    themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark mode" : "Switch to light mode"
    );
});

// Current year in footer
document.getElementById("currentYear").textContent =
    new Date().getFullYear();

// Contact form: opens the user's email application
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const subject = encodeURIComponent("Portfolio Message from " + name);
    const body = encodeURIComponent(
        "Name: " + name +
        "\nEmail: " + email +
        "\n\nMessage:\n" + message
    );

    window.location.href =
        "mailto:jxzminevaliente2907@gmail.com" +
        "?subject=" + subject +
        "&body=" + body;
});

// Load projects from JSON
async function loadProjects() {
    const projectList = document.getElementById("projectList");

    try {
        const response = await fetch("data/projects.json");

        if (!response.ok) {
            throw new Error("Unable to load project data.");
        }

        const projects = await response.json();

        projectList.innerHTML = projects.map((project) => `
            <article class="glass-card project-card">
                <span class="project-label">
                    ${escapeHTML(project.status)}
                </span>
                <h3>${escapeHTML(project.title)}</h3>
                <p>${escapeHTML(project.description)}</p>
                <div class="project-tech">
                    ${project.technologies.map((tech) =>
                        <span>${escapeHTML(tech)}</span>
                    ).join("")}
                </div>
            </article>
        `).join("");
    } catch (error) {
        console.log("Project JSON was not loaded:", error.message);
        // The sample projects in index.html remain visible.
    }
}

// Escape text before inserting it into HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

loadProjects();
