// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8JU2REBh5M9IMcsqa883WUsvYE5GRnrg",
  authDomain: "simple-code-ba1d2.firebaseapp.com",
  databaseURL: "https://simple-code-ba1d2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "simple-code-ba1d2",
  storageBucket: "simple-code-ba1d2.firebasestorage.app",
  messagingSenderId: "1044260240776",
  appId: "1:1044260240776:web:d3e6659669fd7e58310e3d",
  measurementId: "G-QYV8PWMLDT"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Handle registration form submission
document.getElementById('registerForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  // Access inputs only when the form is submitted
  const name = document.getElementById('name')?.value || '';
  const email = document.getElementById('email')?.value || '';
  const username = document.getElementById('username')?.value || '';
  const password = document.getElementById('password')?.value || '';
  const confirmPassword = document.getElementById('confirmPassword')?.value || '';
  const role = document.getElementById('role')?.value || '';

  // Check for password match
  if (password && confirmPassword && password !== confirmPassword) {
    alert('Passwords do not match');
    return; // Stop submission
  }

  // Call the function to register the user
  registerUser(email, password, username, role);
});

// Function to register a new user
export function registerUser(email, password, username, role) {
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return database.ref('users/' + user.uid).set({
        username: username,
        email: email,
        role: role
      });
    })
    .then(() => {
      alert('Registration successful!');
      window.location.href = 'login.html';
    })
    .catch((error) => {
      alert('Registration failed: ' + error.message);
    });
}

// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  // Access inputs only when the form is submitted
  const email = document.getElementById('email')?.value || '';
  const password = document.getElementById('password')?.value || '';

  // Call the function to log in the user
  loginUser(email, password);
});

// Function to log in a user
export function loginUser(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return database.ref('users/' + user.uid).once('value');
    })
    .then((snapshot) => {
      const userData = snapshot.val();
      if (userData.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'user.html';
      }
    })
    .catch((error) => {
      alert('Login failed: ' + error.message);
    });
}

// Function to check if user is logged in and redirect if necessary
function checkAuth() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      database.ref('users/' + user.uid).once('value')
        .then((snapshot) => {
          const userData = snapshot.val();
          if (userData.role === 'admin') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'user.html';
          }
        });
    }
  });
}
//ADMIN DISPLAY
function displayUsers() {
  const usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];

  // Fetch all users from the Realtime Database
  database.ref('users').once('value')
    .then((snapshot) => {
      const users = snapshot.val();

      // Clear the table body before populating
      usersTable.innerHTML = '';

      for (const userId in users) {
        const user = users[userId];

        // Create a new row
        const row = usersTable.insertRow();

        // Insert cells for username, email, and role
        const usernameCell = row.insertCell(0);
        const emailCell = row.insertCell(1);
        const roleCell = row.insertCell(2);

        // Populate the cells
        usernameCell.textContent = user.username || 'N/A'; // Use `username` instead of `name`
        emailCell.textContent = user.email || 'N/A';
        roleCell.textContent = user.role || 'N/A';
      }
    })
    .catch((error) => {
      console.error('Failed to fetch users:', error);
    });
}

// Automatically call displayUsers when on the admin page
if (window.location.pathname.includes('admin.html')) {
  displayUsers();
}



// Automatically call displayUsers when on the admin page
if (window.location.pathname.includes('admin.html')) {
  displayUsers();
}


// Function to sign in with Google
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      return database.ref('users/' + user.uid).once('value');
    })
    .then((snapshot) => {
      if (!snapshot.exists()) {
        // If the user doesn't exist in the database, create a new entry
        return database.ref('users/' + auth.currentUser.uid).set({
          username: auth.currentUser.displayName,
          role: 'user' // Default role for Google Sign-In users
        });
      }
    })
    .then(() => {
      return database.ref('users/' + auth.currentUser.uid).once('value');
    })
    .then((snapshot) => {
      const userData = snapshot.val();
      if (userData.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'user.html';
      }
    })
    .catch((error) => {
      alert('Google Sign-In failed: ' + error.message);
    });
}

// Function to log out
function logout() {
  auth.signOut()
    .then(() => {
      window.location.href = 'login.html';
    })
    .catch((error) => {
      console.error('Logout failed:', error);
    });
}

// Attach the logout function to the global window object
window.logout = logout;

