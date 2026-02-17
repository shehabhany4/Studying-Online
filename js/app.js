
let currentStep = 1;

function nextStep(step) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let createdEvents = JSON.parse(localStorage.getItem('createdEvents')) || [];

function completeEvent() {
    const eventData = {
        name: document.querySelector('input[placeholder*="Adobe"]')?.value || 'New Event',
        startDate: document.querySelector('input[placeholder*="September 24, 2017 07:34"]')?.value || '',
        endDate: document.querySelector('input[placeholder*="September 24, 2017 01:34"]')?.value || '',
        location: document.querySelector('input[placeholder*="Thornridge"]')?.value || '',
        description: document.querySelector('textarea')?.value || '',
        selectedDay: document.querySelector('.calendar-day.active')?.textContent || '12',
        time: '3 PM', 
        id: Date.now()
    };
    
    createdEvents.push(eventData);
    
    localStorage.setItem('createdEvents', JSON.stringify(createdEvents));
    
    displayEventInCalendar(eventData);
    
    alert('Event created successfully!');
    
    nextStep(2);
}

let currentMonth = new Date();

function changeMonth(direction) {
    currentMonth.setMonth(currentMonth.getMonth() + direction);
    updateCalendarDisplay();
}

function updateCalendarDisplay() {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthDisplay = document.querySelector('.calendar-month');
    if (monthDisplay) {
        monthDisplay.textContent = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('eventForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const eventName = form.querySelector('input[placeholder*="Adobe"]');
            
            if (!eventName.value.trim()) {
                alert('Please enter an event name');
                eventName.focus();
                return;
            }
            
            nextStep(2);
        });
    }
    
    if (document.getElementById('step2')) {
        updateCalendarDisplay();
    }
    
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            calendarDays.forEach(d => d.classList.remove('active'));
            
            this.classList.add('active');
            
            const scheduleDate = document.querySelector('.schedule-date');
            if (scheduleDate) {
                const dayNum = this.textContent;
                scheduleDate.textContent = `Sep ${dayNum}, ${getDayName(dayNum)}`;
            }
            
            const selectedEvent = createdEvents.find(e => e.selectedDay === this.textContent);
            if (selectedEvent) {
                updateTimeline(selectedEvent);
            }
        });
    });
    
    loadAllEvents();
});

function getDayName(dayNum) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), parseInt(dayNum));
    return days[date.getDay()];
}

function displayEventInCalendar(eventData) {
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
        if (day.textContent === eventData.selectedDay) {
            if (!day.querySelector('.event-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'event-indicator';
                indicator.style.cssText = `
                    width: 6px;
                    height: 6px;
                    background: #49BBBD;
                    border-radius: 50%;
                    position: absolute;
                    bottom: 5px;
                    left: 50%;
                    transform: translateX(-50%);
                `;
                day.style.position = 'relative';
                day.appendChild(indicator);
            }
        }
    });
    
    updateTimeline(eventData);
}

function updateTimeline(eventData) {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    timeline.innerHTML = '';
    
    const timeSlots = ['2 PM', '3 PM', '4 PM', '5 PM', '6 PM'];
    
    timeSlots.forEach(time => {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        
        const eventsAtThisTime = createdEvents.filter(e => 
            e.time === time && e.selectedDay === eventData.selectedDay
        );
        
        if (eventsAtThisTime.length > 0) {
            slot.classList.add('event-slot');
            slot.innerHTML = `
                <span>${time}</span>
                ${eventsAtThisTime.map(event => `
                    <div class="event-block">
                        ${event.name}
                    </div>
                `).join('')}
            `;
        } else {
            slot.textContent = time;
        }
        
        timeline.appendChild(slot);
    });
}

function loadAllEvents() {
    createdEvents.forEach(event => {
        displayEventInCalendar(event);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const lessonItems = document.querySelectorAll('.lesson-item');
    
    lessonItems.forEach(item => {
        item.addEventListener('click', function() {
            lessonItems.forEach(i => i.classList.remove('active'));
            
            this.classList.add('active');
        });
    });
});

function shareOnSocial(platform) {
    console.log(`Sharing on ${platform}`);
}

function autoSaveFormData() {
    const formData = {
        eventName: document.querySelector('input[placeholder*="Adobe"]')?.value || '',
        startDate: document.querySelector('input[placeholder*="September 24, 2017 07:34"]')?.value || '',
        endDate: document.querySelector('input[placeholder*="September 24, 2017 01:34"]')?.value || '',
        location: document.querySelector('input[placeholder*="Thornridge"]')?.value || '',
        notification: document.querySelector('select')?.value || '',
        email: document.querySelector('input[type="email"]')?.value || '',
        description: document.querySelector('textarea')?.value || ''
    };
    
    localStorage.setItem('eventFormData', JSON.stringify(formData));
}

function loadFormData() {
    const savedData = localStorage.getItem('eventFormData');
    
    if (savedData) {
        const formData = JSON.parse(savedData);
        
        if (formData.eventName) {
            const eventNameInput = document.querySelector('input[placeholder*="Adobe"]');
            if (eventNameInput) eventNameInput.value = formData.eventName;
        }
        
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        input.addEventListener('change', autoSaveFormData);
        input.addEventListener('blur', autoSaveFormData);
    });
    
    loadFormData();
});

function clearFormData() {
    localStorage.removeItem('eventFormData');
    location.reload();
}

document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.querySelector('.btn-back');
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            if (currentStep > 1) {
                prevStep(currentStep - 1);
            } else {
                if (confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
                    window.history.back();
                }
            }
        });
    }
});