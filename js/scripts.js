// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9-RcSPqJdE8rtuAKchAyNqmE6sJcKrQM",
  authDomain: "affordhostel-ff119.firebaseapp.com",
  projectId: "affordhostel-ff119",
  storageBucket: "affordhostel-ff119.appspot.com",
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

// Add New Property (Landlord)
async function addNewProperty(e) {
  e.preventDefault();
  const name = document.getElementById('property-name').value;
  const area = document.getElementById('area').value;
  const price = document.getElementById('price').value;
  const rooms = document.getElementById('rooms').value;
  const description = document.getElementById('description').value;
  const mediaInput = document.getElementById('media');
  if (mediaInput.files.length < 4) {
    alert("Please upload at least 4 images or videos of the property.");
    return;
  }

  // Upload media files to Firebase Storage
  const mediaUrls = [];
  for (let i = 0; i < mediaInput.files.length; i++) {
    const file = mediaInput.files[i];
    const storageRef = storage.ref().child(`hostel_media/${Date.now()}_${file.name}`);
    await storageRef.put(file);
    const url = await storageRef.getDownloadURL();
    mediaUrls.push(url);
  }

  // Save property to Firestore
  try {
    await db.collection("hostels").add({
      name,
      area,
      price,
      numberOfRooms: rooms,
      description,
      media: mediaUrls,
      visible: true,
      roomStatus: Array.from({length: Number(rooms)}, () => "Vacant"),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert("Property added!");
    e.target.reset();
    document.getElementById('map').style.display = "none";
    showManageSubTab('manage-existing');
    await loadLandlordProperties(); // Refresh list
  } catch (error) {
    alert("Failed to add property: " + error.message);
  }
}

// Load Landlord Properties for Manage Existing
async function loadLandlordProperties() {
  const list = document.getElementById('property-list');
  list.innerHTML = "<p>Loading your properties...</p>";
  try {
    const querySnapshot = await db.collection("hostels").orderBy("createdAt", "desc").get();
    if (querySnapshot.empty) {
      list.innerHTML = "<p class='text-gray-500'>No properties added yet.</p>";
      return;
    }
    list.innerHTML = "";
    querySnapshot.forEach((doc, idx) => {
      const prop = doc.data();
      // Room toggles
      let roomsHtml = "";
      for (let i = 0; i < Number(prop.numberOfRooms); i++) {
        const status = prop.roomStatus && prop.roomStatus[i] === "Occupied";
        roomsHtml += `
          <span class="${i > 0 ? 'ml-4' : ''}">
            <span>${101 + i}</span>
            <button onclick="toggleRoomStatusFirestore('${doc.id}', ${i}, this)" class="ml-2 px-2 py-1 text-xs rounded ${status ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}">${status ? 'Occupied' : 'Vacant'}</button>
          </span>
        `;
      }
      // Property card
      list.innerHTML += `
        <div class="border rounded p-4 shadow mb-2">
          <div class="flex justify-between items-center">
            <div>
              <h4 class="font-semibold text-lg">${prop.name}</h4>
              <p class="text-gray-600 text-sm">Area: ${prop.area}</p>
              <p class="text-gray-600 text-sm">Price: KSH ${prop.price}</p>
              <p class="text-gray-600 text-sm">Rooms: ${roomsHtml}</p>
              <p class="text-gray-600 text-sm">Description: ${prop.description}</p>
            </div>
            <div class="flex flex-col items-end">
              <label class="flex items-center mb-2">
                <input type="checkbox" ${prop.visible ? "checked" : ""} onchange="toggleVisibilityFirestore('${doc.id}', this)" class="mr-2">
                <span class="text-sm">${prop.visible ? "Visible" : "Hidden"}</span>
              </label>
              <button onclick="editPropertyFirestore('${doc.id}', this)" class="text-blue-600 hover:underline text-sm mb-1">Edit</button>
              <button onclick="savePropertyFirestore('${doc.id}', this)" class="text-green-600 hover:underline text-sm hidden">Save</button>
            </div>
          </div>
          <div class="edit-fields hidden mt-2">
            <input type="text" value="${prop.name}" class="w-full p-2 border rounded mb-2 edit-name">
            <select class="w-full p-2 border rounded mb-2 edit-area">
              <option value="Kikoni" ${prop.area === "Kikoni" ? "selected" : ""}>Kikoni</option>
              <option value="Wandegeya" ${prop.area === "Wandegeya" ? "selected" : ""}>Wandegeya</option>
              <option value="Makerere" ${prop.area === "Makerere" ? "selected" : ""}>Makerere</option>
              <option value="Kasubi" ${prop.area === "Kasubi" ? "selected" : ""}>Kasubi</option>
            </select>
            <input type="number" value="${prop.price}" class="w-full p-2 border rounded mb-2 edit-price">
            <input type="number" value="${prop.numberOfRooms}" class="w-full p-2 border rounded mb-2 edit-rooms" min="1">
            <textarea class="w-full p-2 border rounded mb-2 edit-description">${prop.description}</textarea>
          </div>
        </div>
      `;
    });
  } catch (error) {
    list.innerHTML = "<p class='text-red-600'>Error loading properties.</p>";
  }
}

// Toggle property visibility in Firestore
async function toggleVisibilityFirestore(docId, checkbox) {
  try {
    await db.collection("hostels").doc(docId).update({ visible: checkbox.checked });
    await loadLandlordProperties();
  } catch (error) {
    alert("Failed to update visibility: " + error.message);
  }
}

// Toggle room status in Firestore
async function toggleRoomStatusFirestore(docId, roomIdx, btn) {
  try {
    const docRef = db.collection("hostels").doc(docId);
    const docSnap = await docRef.get();
    let roomStatus = docSnap.data().roomStatus || [];
    roomStatus[roomIdx] = roomStatus[roomIdx] === "Occupied" ? "Vacant" : "Occupied";
    await docRef.update({ roomStatus });
    await loadLandlordProperties();
  } catch (error) {
    alert("Failed to update room status: " + error.message);
  }
}

// Edit property fields (show edit fields)
function editPropertyFirestore(docId, btn) {
  const card = btn.closest('.border');
  card.querySelector('.edit-fields').classList.remove('hidden');
  btn.classList.add('hidden');
  card.querySelector('.text-green-600').classList.remove('hidden');
}

// Save property fields to Firestore
async function savePropertyFirestore(docId, btn) {
  const card = btn.closest('.border');
  const name = card.querySelector('.edit-name').value;
  const area = card.querySelector('.edit-area').value;
  const price = card.querySelector('.edit-price').value;
  const rooms = card.querySelector('.edit-rooms').value;
  const description = card.querySelector('.edit-description').value;
  try {
    await db.collection("hostels").doc(docId).update({
      name, area, price, numberOfRooms: rooms, description
    });
    await loadLandlordProperties();
  } catch (error) {
    alert("Failed to update property: " + error.message);
  }
}

// Load Hostels for Students (browse)
async function loadStudentHostels() {
  const hostelList = document.getElementById("hostel-browse-list");
  if (!hostelList) return;
  hostelList.innerHTML = "<p>Loading hostels...</p>";
  try {
    const querySnapshot = await db.collection("hostels").where("visible", "==", true).get();
    hostelList.innerHTML = "";
    if (querySnapshot.empty) {
      hostelList.innerHTML = "<p class='text-gray-600'>No hostels available at the moment.</p>";
      return;
    }
    querySnapshot.forEach((doc) => {
      const hostel = doc.data();
      const hostelCard = `
        <div class="bg-white p-4 border rounded shadow">
          <h4 class="text-lg font-semibold">${hostel.name}</h4>
          <p class="text-gray-600">Location: ${hostel.area}</p>
          <p class="text-gray-600">Price: KSH ${hostel.price}</p>
          <p class="text-gray-600">Rooms: ${hostel.numberOfRooms}</p>
          <div class="mt-2">
            <button onclick="viewOnMap(${hostel.location?.latitude || 0}, ${hostel.location?.longitude || 0})" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View on Map</button>
            <button onclick="redirectToOSM(${hostel.location?.latitude || 0}, ${hostel.location?.longitude || 0})" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Open in OSM</button>
            <button onclick="getDirections(${hostel.location?.latitude || 0}, ${hostel.location?.longitude || 0})" class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Get Directions</button>
          </div>
        </div>
      `;
      hostelList.innerHTML += hostelCard;
    });
  } catch (error) {
    hostelList.innerHTML = "<p class='text-red-600'>Error loading hostels. Please try again later.</p>";
  }
}

// View on Map
function viewOnMap(latitude, longitude) {
  alert(`Viewing hostel on map at coordinates: ${latitude}, ${longitude}`);
  // Add map integration logic here
}

// Redirect to OpenStreetMap
function redirectToOSM(latitude, longitude) {
  const osmUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=18/${latitude}/${longitude}`;
  window.open(osmUrl, "_blank");
}

// Get Directions
function getDirections(latitude, longitude) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  window.open(directionsUrl, "_blank");
}

// Logout Function
function logout() {
  auth.signOut()
    .then(() => {
      alert("Logged out successfully.");
      window.location.href = "landlord-login.html";
    })
    .catch((error) => {
      alert("Failed to log out: " + error.message);
    });
}

// Attach landlord property form handler
document.addEventListener("DOMContentLoaded", () => {
  // For landlord add property
  const propertyForm = document.getElementById('property-form');
  if (propertyForm) {
    propertyForm.addEventListener('submit', addNewProperty);
  }
  // For landlord manage existing
  if (document.getElementById('property-list')) {
    loadLandlordProperties();
  }
  // For student browse
  if (document.getElementById("hostel-browse-list")) {
    loadStudentHostels();
  }
});