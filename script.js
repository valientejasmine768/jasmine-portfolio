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

// Projects: GitHub repositories load automatically; projects.json holds extra practice ideas
const GITHUB_USER = "valientejasmine768";
const HIDDEN_REPOS = ["jasmine-portfolio", GITHUB_USER + ".github.io"];

async function fetchRepos() {
    const cacheKey = "portfolio-repos-v1";

    try {
        const cached = JSON.parse(sessionStorage.getItem(cacheKey));
        if (cached && Date.now() - cached.time < 10 * 60 * 1000) {
            return cached.repos;
        }
    } catch (error) { /* no usable cache */ }

    const response = await fetch(
        "https://api.github.com/users/" + GITHUB_USER +
        "/repos?per_page=100&sort=pushed"
    );
    if (!response.ok) {
        throw new Error("GitHub returned " + response.status);
    }

    const repos = (await response.json()).filter((repo) =>
        !repo.fork && !repo.archived &&
        !HIDDEN_REPOS.includes(repo.name.toLowerCase())
    );

    try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), repos }));
    } catch (error) { /* storage unavailable */ }

    return repos;
}

function prettyName(name) {
    if (/[A-Z ]/.test(name)) return name;
    return name.replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function projectCard({ label, title, description, tech, url }) {
    return `
        <article class="glass-card project-card">
            <span class="project-label">${escapeHTML(label)}</span>
            <h3>${escapeHTML(title)}</h3>
            <p>${escapeHTML(description)}</p>
            <div class="project-tech">
                ${tech.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}
            </div>
            ${url ? `<a class="project-link" href="${escapeHTML(url)}"
                target="_blank" rel="noopener noreferrer">View on GitHub ↗</a>` : ""}
        </article>
    `;
}

async function loadProjects() {
    const projectList = document.getElementById("projectList");
    const note = document.getElementById("projectsNote");
    const cards = [];
    let repoCount = 0;

    try {
        const repos = await fetchRepos();
        repoCount = repos.length;

        repos.forEach((repo) => cards.push(projectCard({
            label: "GITHUB REPO",
            title: prettyName(repo.name),
            description: repo.description ||
                "A project from my GitHub. A description will be added soon.",
            tech: [repo.language, ...(repo.topics || [])]
                .filter(Boolean).slice(0, 4),
            url: repo.html_url
        })));
    } catch (error) {
        console.log("GitHub repos were not loaded:", error.message);
    }

    try {
        const response = await fetch("projects.json");
        if (!response.ok) throw new Error("Unable to load project data.");

        (await response.json()).forEach((project) => cards.push(projectCard({
            label: project.status,
            title: project.title,
            description: project.description,
            tech: project.technologies
        })));
    } catch (error) {
        console.log("Project JSON was not loaded:", error.message);
    }

    // If nothing loaded, the sample projects in index.html stay visible.
    if (!cards.length) return;

    projectList.innerHTML = cards.join("");
    if (note && repoCount) {
        note.textContent =
            "Repositories are added automatically from my GitHub. " +
            "Practice ideas are not completed projects.";
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
