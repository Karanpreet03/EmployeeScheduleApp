document.addEventListener('DOMContentLoaded', () => {
    // Handle login form submission
    const loginForm = document.getElementById('login');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
          const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          });
          const data = await response.json();
          if (response.ok) {
            document.cookie = `token=${data.token};path=/`;
            window.location.href = data.role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
          } else {
            alert('Login failed: ' + (data.message || 'Unknown error'));
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Login failed: ' + error.message);
        }
      });
    }
  
    // Handle create user form submission
    const createUserForm = document.getElementById('userForm');
    if (createUserForm) {
      createUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('create-username').value;
        const password = document.getElementById('create-password').value;
        const role = document.getElementById('create-role').value;
        try {
          const response = await fetch('http://localhost:3001/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify({ username, password, role })
          });
          const data = await response.json();
          if (response.ok) {
            alert('User created successfully');
            createUserForm.reset();
          } else {
            alert('Error creating user: ' + (data.message || 'Unknown error'));
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Error creating user: ' + error.message);
        }
      });
    }
  
    // Handle create schedule form submission
    const createScheduleForm = document.getElementById('scheduleForm');
    const scheduleUserSelect = document.getElementById('schedule-user');
    if (createScheduleForm) {
      createScheduleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = scheduleUserSelect.value;
        const scheduleDetails = document.getElementById('schedule-details').value;
        const startTime = document.getElementById('schedule-start-time').value;
        const endTime = document.getElementById('schedule-end-time').value;
        try {
          const response = await fetch('http://localhost:3001/api/schedules', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify({ userId, schedule: scheduleDetails, startTime, endTime })
          });
          const data = await response.json();
          if (response.ok) {
            alert('Schedule created successfully');
            createScheduleForm.reset();
          } else {
            alert('Error creating schedule: ' + (data.message || 'Unknown error'));
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Error creating schedule: ' + error.message);
        }
      });
    }
  
    // Fetch users for the schedule dropdown
    if (createScheduleForm) {
      (async () => {
        try {
          const response = await fetch('http://localhost:3001/api/users', {
            headers: {
              'Authorization': `Bearer ${getCookie('token')}`
            }
          });
          const users = await response.json();
          if (response.ok) {
            scheduleUserSelect.innerHTML = users.map(user =>
              `<option value="${user._id}">${user.username}</option>`
            ).join('');
          } else {
            alert('Error fetching users');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Error fetching users: ' + error.message);
        }
      })();
    }
  
    // Load schedules for user dashboard
    const loadSchedules = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/schedules', {
          headers: {
            'Authorization': `Bearer ${getCookie('token')}`
          }
        });
        const schedules = await response.json();
        if (response.ok) {
          const scheduleList = document.getElementById('schedule-list');
          if (scheduleList) {
            scheduleList.innerHTML = schedules.map(schedule => `
                <li>
                  <strong>Schedule:</strong> ${schedule.schedule}<br>
                  <strong>Start Time:</strong> ${schedule.startTime}<br>
                  <strong>End Time:</strong> ${schedule.endTime}
                </li>
              `).join('');
          }
        } else {
          alert('Error fetching schedules');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error fetching schedules: ' + error.message);
      }
    };
  
    if (document.getElementById('schedule-list')) {
      loadSchedules();
    }
  
    // Utility function to get cookie value
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
  });
  