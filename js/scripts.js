// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9-RcSPqJdE8rtuAKchAyNqmE6sJcKrQM",
  authDomain: "affordhostel-ff119.firebaseapp.com",
  projectId: "affordhostel-ff119",
  storageBucket: "affordhostel-ff119.firebasestorage.app",
  messagingSenderId: "330171528496",
  appId: "1:330171528496:web:7f8d844da4d1a62403c4f5"
};

// Initialize Firebase
let auth, db, storage;
try {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
  storage = firebase.storage();
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization failed:", error);
  alert("Error initializing Firebase. Please check your configuration.");
}

// Load Hostels for Students
async function loadStudentHostels() {
  const hostelList = document.getElementById("hostel-browse-list");
  hostelList.innerHTML = "<p>Loading hostels...</p>";
  console.log("Attempting to load hostels from Firestore...");

  try {
    const querySnapshot = await db.collection("hostels").get();
    hostelList.innerHTML = ""; // Clear loading message

    if (querySnapshot.empty) {
      hostelList.innerHTML = "<p class='text-gray-600'>No hostels available at the moment.</p>";
      console.log("No hostels found in Firestore.");
      return;
    }

    querySnapshot.forEach((doc) => {
      const hostel = doc.data();
      console.log("Hostel data fetched:", hostel); // Debugging
      const hostelCard = `
        <div class="bg-white p-4 border rounded shadow">
          <h4 class="text-lg font-semibold">${hostel.name}</h4>
          <p class="text-gray-600">Location: ${hostel.area}</p>
          <p class="text-gray-600">Price: KSH ${hostel.price}</p>
          <p class="text-gray-600">Rooms: ${hostel.numberOfRooms}</p>
          <div class="mt-2">
            <button onclick="viewOnMap(${hostel.location.latitude}, ${hostel.location.longitude})" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View on Map</button>
            <button onclick="redirectToOSM(${hostel.location.latitude}, ${hostel.location.longitude})" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Open in OSM</button>
            <button onclick="getDirections(${hostel.location.latitude}, ${hostel.location.longitude})" class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Get Directions</button>
          </div>
        </div>
      `;
      hostelList.innerHTML += hostelCard;
    });
    console.log("Hostels loaded successfully.");
  } catch (error) {
    console.error("Error loading hostels:", error);
    hostelList.innerHTML = "<p class='text-red-600'>Error loading hostels. Please try again later.</p>";
  }
}

// View Hostel on Map
function viewOnMap(lat, lng) {
  console.log(`Viewing hostel on map at coordinates: ${lat}, ${lng}`);
  const mapDiv = document.getElementById("map");
  mapDiv.classList.remove("hidden");

  const map = L.map("map").setView([lat, lng], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  L.marker([lat, lng]).addTo(map).bindPopup("Hostel Location").openPopup();
}

// Redirect to OpenStreetMap
function redirectToOSM(lat, lng) {
  console.log(`Redirecting to OpenStreetMap for coordinates: ${lat}, ${lng}`);
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`;
  window.open(osmUrl, "_blank");
}

// Get Directions
function getDirections(lat, lng) {
  console.log(`Getting directions to coordinates: ${lat}, ${lng}`);
  const userLocation = prompt("Enter your location (or leave blank to use your current location):");

  if (userLocation) {
    // Use custom location
    console.log(`Using custom location: ${userLocation}`);
    const osmDirectionsUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${encodeURIComponent(userLocation)};${lat},${lng}`;
    window.open(osmDirectionsUrl, "_blank");
  } else {
    // Use current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        console.log(`Using current location: ${userLat}, ${userLng}`);
        const osmDirectionsUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLat},${userLng};${lat},${lng}`;
        window.open(osmDirectionsUrl, "_blank");
      }, (error) => {
        console.error("Error retrieving current location:", error);
        alert("Unable to retrieve your location. Please allow location access or enter a custom location.");
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by your browser. Please enter a custom location.");
    }
  }
}

// Logout Function
function logout() {
  auth.signOut()
    .then(() => {
      console.log("User logged out successfully.");
      alert("Logged out successfully.");
      window.location.href = "landlord-login.html";
    })
    .catch((error) => {
      console.error("Error logging out:", error);
      alert("Failed to log out: " + error.message);
    });
}

// Load hostels on page load
document.addEventListener("DOMContentLoaded", () => {
  console.log("Document loaded. Initializing hostel loading...");
  loadStudentHostels();
});