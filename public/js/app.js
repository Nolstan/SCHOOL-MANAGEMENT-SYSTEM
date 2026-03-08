const API_BASE = window.location.port === '5001' ? '' : 'http://localhost:5001';

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links li');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('page-title');

    // Function to show a specific page
    function showPage(pageId) {
        if (!pageId) return;

        pages.forEach(p => p.classList.add('hidden'));
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            // Update active state in nav
            navLinks.forEach(l => {
                if (l.dataset.page === pageId) l.classList.add('active');
                else l.classList.remove('active');
            });
            // Save to localStorage
            localStorage.setItem('activePage-' + window.location.pathname, pageId);
        }
    }

    // Page Switching Logic
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const pageId = link.dataset.page;
            showPage(pageId);
        });
    });

    // Check for saved page on load
    const savedPage = localStorage.getItem('activePage-' + window.location.pathname);
    if (savedPage) {
        showPage(savedPage);
    }

    // Role-Based UI Logic
    const isTeacherPage = window.location.pathname.includes('teacher.html');

    function updateUI() {
        if (isTeacherPage) {
            const userEl = document.getElementById('username');
            if (userEl) userEl.innerText = 'Teacher';
        } else {
            const usernameEl = document.getElementById('username');
            if (usernameEl) usernameEl.innerText = 'Student';
        }
    }

    updateUI();
    loadAwards();

    // AI Tutor Logic
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const chatBox = document.getElementById('chat-box');

    if (aiSend) {
        aiSend.addEventListener('click', async () => {
            const question = aiInput.value;
            if (!question) return;

            appendMessage('Student', question);
            aiInput.value = '';

            try {
                const response = await fetch(`${API_BASE}/api/ai/tutor`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Server error occurred');
                appendMessage('AI Tutor', data.response);
            } catch (error) {
                console.error('Frontend Error:', error);
                appendMessage('Error', error.message);
            }
        });
    }

    function appendMessage(sender, text) {
        if (!chatBox) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message';
        msgDiv.innerHTML = `<strong>${sender}:</strong> <p>${text}</p>`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Initial Load
    fetchActivities();
    fetchStats();
    if (isTeacherPage) {
        loadAttendanceData();
        loadGuardians();
        loadModules();
        loadStudents();
    }
});

async function loadModules() {
    const mList = document.getElementById('modules-list');
    const attendanceClassSelect = document.getElementById('attendance-class-select');
    const studentClassSelect = document.getElementById('student-class-select');
    if (!mList) return;

    try {
        const res = await fetch(`${API_BASE}/api/modules`);
        const modules = await res.json();
        console.log('Loaded modules:', modules.length);

        mList.innerHTML = '<h3>Active Modules</h3>' + modules.map(m => `
            <div class="guardian-card">
                <p><strong>${m.subjectName}</strong> - ${m.className}</p>
                <small>Teacher: ${m.teacherId ? m.teacherId.username : 'Not Assigned'}</small>
            </div>
        `).join('');

        // Note: We no longer overwrite attendanceClassSelect or studentClassSelect
        // as they are now hardcoded in teacher.html for consistency.

    } catch (e) { console.error('Error loading modules', e); }
}

document.getElementById('save-module-btn')?.addEventListener('click', async () => {
    const subject = document.getElementById('module-subject').value;
    const className = document.getElementById('module-class').value;
    const teacherId = document.getElementById('module-teacher-select').value;

    if (!subject || !className) return alert('Subject and Class are required');

    const progressContainer = document.getElementById('module-progress-container');
    const progressBar = document.getElementById('module-progress-bar');
    const statusText = document.getElementById('module-status-text');
    const saveBtn = document.getElementById('save-module-btn');

    progressContainer.classList.remove('hidden');
    saveBtn.disabled = true;

    const steps = [
        { progress: 25, text: 'Validating data...' },
        { progress: 50, text: 'Assigning resources...' },
        { progress: 75, text: 'Syncing with database...' }
    ];

    try {
        for (const step of steps) {
            statusText.innerText = step.text;
            progressBar.style.width = step.progress + '%';
            await new Promise(r => setTimeout(r, 400));
        }

        const res = await fetch(`${API_BASE}/api/modules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subjectName: subject, className: className, teacherId: teacherId || null })
        });

        if (res.ok) {
            statusText.innerText = 'Module created successfully!';
            progressBar.style.width = '100%';

            setTimeout(() => {
                progressContainer.classList.add('hidden');
                progressBar.style.width = '0%';
                saveBtn.disabled = false;
                document.getElementById('module-subject').value = '';
                document.getElementById('module-class').value = '';
                loadModules();
            }, 800);
        } else {
            let errorMessage = 'Failed to save module';
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errData = await res.json();
                errorMessage = errData.error || errorMessage;
            } else {
                const text = await res.text();
                errorMessage = text || `Server returned ${res.status}`;
            }
            throw new Error(errorMessage);
        }
    } catch (e) {
        console.error('Error saving module', e);
        alert('Error: ' + e.message);
        saveBtn.disabled = false;
        progressContainer.classList.add('hidden');
    }
});

async function loadStudents() {
    const sList = document.getElementById('students-list');
    if (!sList) return;
    try {
        const res = await fetch(`${API_BASE}/api/students`);
        const students = await res.json();
        sList.innerHTML = students.map(s => `
            <div class="guardian-card">
                <p><strong>${s.firstName} ${s.lastName}</strong></p>
                <small>Parent: ${s.parentName} (${s.parentPhone})</small>
            </div>
        `).join('');
    } catch (e) { console.error('Error loading students', e); }
}

document.getElementById('save-student-btn')?.addEventListener('click', async () => {
    const data = {
        firstName: document.getElementById('student-fname').value,
        lastName: document.getElementById('student-lname').value,
        parentName: document.getElementById('student-parent-name').value,
        parentPhone: document.getElementById('student-parent-phone').value,
        className: document.getElementById('student-class-select').value
    };

    if (!data.firstName || !data.parentPhone || !data.className) return alert('Name, Phone, and Class are required');

    try {
        const res = await fetch(`${API_BASE}/api/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert('Student Registered!');
            loadStudents();
            loadGuardians();
            // Clear form
            ['student-fname', 'student-lname', 'student-parent-name', 'student-parent-phone', 'student-class-select'].forEach(id => {
                document.getElementById(id).value = '';
            });
        }
    } catch (e) { console.error('Error saving student', e); }
});

async function loadAttendanceData() {
    loadModules();

    document.getElementById('attendance-class-select')?.addEventListener('change', async (e) => {
        const selectedClass = e.target.value;
        if (!selectedClass) return;

        console.log('[Debug] Attendance Class Select Changed:', selectedClass);
        try {
            const url = `${API_BASE}/api/modules`;
            console.log('[Debug] Fetching modules from:', url);

            const res = await fetch(url);
            const modules = await res.json();
            console.log('[Debug] Total modules received:', modules.length);

            // Case-insensitive match for robustness
            const filteredModules = modules.filter(m =>
                m.className && m.className.toString().trim().toLowerCase() === selectedClass.trim().toLowerCase()
            );

            console.log(`[Debug] Filtered Modules for "${selectedClass}":`, filteredModules);

            const subjectSelect = document.getElementById('attendance-subject-select');
            if (subjectSelect) {
                if (filteredModules.length === 0) {
                    subjectSelect.innerHTML = '<option value="">No subjects found for this class</option>';
                } else {
                    subjectSelect.innerHTML = '<option value="">Select Subject</option>' +
                        filteredModules.map(m => `<option value="${m._id}">${m.subjectName}</option>`).join('');
                }
                console.log('[Debug] Subject select updated.');
            } else {
                console.error('[Debug] attendance-subject-select NOT found in DOM!');
            }
        } catch (error) {
            console.error('[Debug] Error loading subjects for class:', error);
        }
    });

    document.getElementById('load-attendance-btn')?.addEventListener('click', async () => {
        const className = document.getElementById('attendance-class-select').value;
        const moduleId = document.getElementById('attendance-subject-select').value;
        if (!className || !moduleId) return alert('Select class and subject');

        const studentRes = await fetch(`${API_BASE}/api/students?className=${encodeURIComponent(className)}`);
        const students = await studentRes.json();

        const attendanceList = document.getElementById('attendance-list');
        attendanceList.innerHTML = students.length === 0
            ? '<p class="form-desc" style="text-align:center; padding: 2rem;">No students found in this class.</p>'
            : students.map(s => `
            <div class="attendance-item">
                <span>${s.firstName} ${s.lastName}</span>
                <button onclick="markAttendance('${s._id}', 'present', '${moduleId}')">Attended</button>
                <button onclick="markAttendance('${s._id}', 'absent', '${moduleId}')">Absent</button>
            </div>
        `).join('');
    });
}

async function markAttendance(studentId, status, moduleId) {
    try {
        const res = await fetch(`${API_BASE}/api/attendance/mark`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, status, moduleId })
        });
        const data = await res.json();
        if (res.ok) {
            alert(`Attendance recorded: ${status}`);
        } else {
            alert('Error: ' + data.error);
        }
    } catch (e) { console.error('Error marking attendance', e); }
}

async function loadGuardians() {
    const gList = document.getElementById('guardians-list');
    if (!gList) return;
    try {
        const res = await fetch(`${API_BASE}/api/students`); // Use students list as parent directory
        const students = await res.json();
        // Unique parents
        const parents = [...new Map(students.map(s => [s.parentPhone, s])).values()];

        gList.innerHTML = parents.map(p => `
            <div class="guardian-card">
                <p><strong>${p.parentName}</strong> - ${p.parentPhone}</p>
                <small>Student: ${p.firstName} ${p.lastName}</small>
            </div>
        `).join('');
    } catch (e) { console.error('Error loading guardians', e); }
}

let cachedActivities = [];

async function fetchActivities() {
    const teacherList = document.getElementById('teacher-activities-list');
    const studentFullList = document.getElementById('student-activities-full-list');
    if (!teacherList && !studentFullList) return;

    try {
        const res = await fetch(`${API_BASE}/api/activities`);
        cachedActivities = await res.json();
        renderFilteredActivities();
    } catch (e) { console.error('Error fetching activities'); }
}

function renderFilteredActivities(filter = '') {
    const teacherList = document.getElementById('teacher-activities-list');
    const studentFullList = document.getElementById('student-activities-full-list');

    const filtered = cachedActivities.filter(a =>
        a.targetClass.toLowerCase().includes(filter.toLowerCase()) ||
        filter === ''
    ).reverse();

    const renderActivity = (a) => `
        <div class="activity-card">
            <div class="activity-header">
                <span class="activity-tag ${a.category}">${a.category}</span>
                <span class="activity-cost">${a.cost > 0 ? `MWK ${a.cost}` : 'FREE'}</span>
            </div>
            <div class="activity-body">
                <h3>${a.title}</h3>
                <p style="color: var(--text-muted); line-height: 1.6; font-size: 0.95rem;">${a.description}</p>
            </div>
            <div class="activity-details">
                <div>
                    <span class="detail-label">Classes</span>
                    <div class="detail-item">${a.targetClass}</div>
                </div>
                <div>
                    <span class="detail-label">Location</span>
                    <div class="detail-item">${a.location}</div>
                </div>
                <div>
                    <span class="detail-label">Date</span>
                    <div class="detail-item">${new Date(a.eventDate).toLocaleDateString()}</div>
                </div>
                <div>
                    <span class="detail-label">Contact</span>
                    <div class="detail-item">${a.contactInfo}</div>
                </div>
            </div>
        </div>
    `;

    const html = filtered.map(renderActivity).join('');
    if (teacherList) teacherList.innerHTML = html;
    if (studentFullList) studentFullList.innerHTML = html;
}

// Search input listeners
document.getElementById('student-activity-search')?.addEventListener('input', (e) => {
    renderFilteredActivities(e.target.value);
});

document.getElementById('teacher-activity-search')?.addEventListener('input', (e) => {
    renderFilteredActivities(e.target.value);
});

document.getElementById('save-activity-btn')?.addEventListener('click', async () => {
    const title = document.getElementById('activity-title').value;
    const category = document.getElementById('activity-category').value;
    const targetClass = document.getElementById('activity-target-class').value;
    const eventDate = document.getElementById('activity-date').value;
    const location = document.getElementById('activity-location').value;
    const contactInfo = document.getElementById('activity-contact').value;
    const cost = document.getElementById('activity-cost').value || 0;
    const description = document.getElementById('activity-desc').value;

    if (!title || !targetClass || !eventDate || !location || !contactInfo || !description) {
        return alert('Please fill in all required fields');
    }

    try {
        const res = await fetch(`${API_BASE}/api/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, category, targetClass, eventDate, location, contactInfo, cost, description })
        });

        if (res.ok) {
            alert('Activity posted successfully!');
            fetchActivities();
            // Clear fields
            ['activity-title', 'activity-target-class', 'activity-date', 'activity-location', 'activity-contact', 'activity-cost', 'activity-desc'].forEach(id => {
                document.getElementById(id).value = '';
            });
        }
    } catch (e) { alert('Error posting activity'); }
});

async function loadAwards() {
    const list = document.getElementById('awards-list');
    const featuredSection = document.getElementById('featured-star-section');
    if (!list && !featuredSection) return;

    const awards = JSON.parse(localStorage.getItem('edu-awards') || '[]');
    if (awards.length === 0) {
        if (list) list.innerHTML = '<p class="form-desc" style="text-align:center; padding: 2rem;">No awards posted yet this week.</p>';
        if (featuredSection) featuredSection.classList.add('hidden');
        return;
    }

    const latest = awards[awards.length - 1];

    // Handle high-impact featured section (Home/Student Page)
    if (featuredSection) {
        featuredSection.classList.remove('hidden');
        const starName = document.getElementById('star-name');
        const starDesc = document.getElementById('star-description');
        const starType = document.getElementById('star-type');

        if (starName) starName.innerText = latest.studentName;
        if (starDesc) starDesc.innerText = latest.description;
        if (starType) starType.innerText = latest.type;

        const imgContainer = document.getElementById('star-image-container');
        if (imgContainer) {
            imgContainer.innerHTML = latest.image
                ? `<img src="${latest.image}" alt="${latest.studentName}">`
                : `<div style="background: linear-gradient(135deg, var(--primary), var(--primary-hover)); color: white;">🌟</div>`;
        }
    }

    // Handle secondary list (Teacher/Admin View)
    if (list) {
        list.innerHTML = awards.reverse().map(a => `
        <div class="award-card">
            ${a.image ? `<img src="${a.image}" class="award-img">` : '<div class="award-img" style="background: linear-gradient(135deg, var(--primary), var(--primary-hover)); display:flex; align-items:center; justify-content:center; color: white; font-size:5rem;">🌟</div>'}
            <div class="award-info">
                <h3>${a.type}</h3>
                <p>${a.studentName}</p>
                <small style="display:block; line-height: 1.4; color: var(--text-muted);">${a.description}</small>
            </div>
        </div>
    `).join('');
    }
}

document.getElementById('save-award-btn')?.addEventListener('click', async () => {
    const type = document.getElementById('award-type').value;
    const name = document.getElementById('award-student-name').value;
    const desc = document.getElementById('award-description').value;
    const picInput = document.getElementById('award-student-pic');

    if (!name || !desc) return alert('Student name and description are required');

    let base64Image = null;
    if (picInput && picInput.files && picInput.files[0]) {
        base64Image = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(picInput.files[0]);
        });
    }

    const awards = JSON.parse(localStorage.getItem('edu-awards') || '[]');
    awards.push({ type, studentName: name, description: desc, image: base64Image, date: new Date() });
    localStorage.setItem('edu-awards', JSON.stringify(awards));

    alert('Award posted successfully!');
    document.getElementById('award-student-name').value = '';
    document.getElementById('award-description').value = '';
    if (picInput) picInput.value = '';
    loadAwards();
});

async function fetchStats() {
    const totalStudentsEl = document.getElementById('total-students');
    if (!totalStudentsEl) return;
    try {
        const res = await fetch(`${API_BASE}/api/students`);
        const students = await res.json();
        totalStudentsEl.innerText = students.length;
    } catch (e) { console.error('Error fetching stats'); }
}
