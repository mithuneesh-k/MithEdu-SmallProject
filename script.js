/**
 * MithEdu Core Logic (v3.0.0)
 * ----------------------------
 * Handles colorful course mappings, API integration, and user state.
 */

"use strict";

const CONFIG = {
    API_URL: "https://jsonplaceholder.typicode.com/users",
    STORAGE_KEY: "mithEdu_user_v3",
    MAPPING: [
        { name: "Tony Stark", subject: "AI Engineering", email: "stark@avengers.edu" },
        { name: "Chandler Bing", subject: "Statistical Analysis", email: "c.bing@transponster.com" },
        { name: "Michael Scott", subject: "Database Management", email: "m.scott@dunder.com" },
        { name: "Harvey Specter", subject: "AI Ethics and Law", email: "h.specter@pearson.com" },
        { name: "Wanda Maximoff", subject: "Reality Engineering", email: "wanda@westview.org" }
    ]
};

const els = {
    clock: document.getElementById("live-clock"),
    body: document.body,
    pageType: document.body.getAttribute("data-page")
};

// --- 1. Real-time Clock ---
const startClock = () => {
    if (!els.clock) return;
    setInterval(() => {
        els.clock.textContent = new Date().toLocaleTimeString();
    }, 1000);
};

// --- 2. Greeting Logic ---
const initGreeting = () => {
    const welcome = document.getElementById("welcome-msg");
    const userDisplay = document.getElementById("user-display");
    if (!welcome || !userDisplay) return;

    const name = localStorage.getItem(CONFIG.STORAGE_KEY);
    
    setTimeout(() => {
        if (name) {
            welcome.innerHTML = `Good Day, <em>${name}</em>.`;
            userDisplay.textContent = "Your academic progress is synced.";
        } else {
            welcome.innerHTML = "Welcome, <em>Student</em>.";
            userDisplay.textContent = "Register your profile to get personalized stats.";
        }
    }, 1200);
};

// --- 3. Mentor Directory (API) ---
const loadMentors = async () => {
    const list = document.getElementById("mentors-list");
    if (!list) return;

    list.innerHTML = '<p>Synchronizing with academic servers...</p>';
    
    try {
        const response = await fetch(CONFIG.API_URL);
        const users = await response.json();
        
        list.innerHTML = "";
        CONFIG.MAPPING.forEach((mentor, index) => {
            const apiUser = users[index % users.length];
            const card = document.createElement("div");
            card.className = "mentor-card";
            card.innerHTML = `
                <span class="m-name">${mentor.name}</span>
                <span class="m-detail">${mentor.subject}</span>
                <span class="m-detail">${apiUser.address.city} Campus</span>
                <span class="m-email">${mentor.email}</span>
            `;
            list.appendChild(card);
        });
    } catch (e) {
        list.innerHTML = "<p class='error-text'>Failed to load advisor directory.</p>";
    }
};

// --- 4. Enrollment ---
const initEnrollment = () => {
    const form = document.getElementById("enrollment-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const course = document.getElementById("course").value;
        
        let valid = true;
        if (name.length < 2) {
            document.getElementById("name-error").textContent = "Full name required.";
            valid = false;
        } else { document.getElementById("name-error").textContent = ""; }
        
        if (!email.includes("@")) {
            document.getElementById("email-error").textContent = "Invalid email format.";
            valid = false;
        } else { document.getElementById("email-error").textContent = ""; }
        
        if (!course) {
            document.getElementById("course-error").textContent = "Selection required.";
            valid = false;
        } else { document.getElementById("course-error").textContent = ""; }
        
        if (valid) {
            localStorage.setItem(CONFIG.STORAGE_KEY, name);
            document.getElementById("enrolled-course").textContent = course;
            document.getElementById("success-msg").classList.remove("hidden");
            form.classList.add("hidden");
        }
    });
};

// --- Boot ---
document.addEventListener("DOMContentLoaded", () => {
    startClock();
    if (els.pageType === "home") initGreeting();
    if (els.pageType === "enroll") initEnrollment();
    if (els.pageType === "mentors") {
        loadMentors();
        document.getElementById("refresh-mentors")?.addEventListener("click", loadMentors);
    }
});
