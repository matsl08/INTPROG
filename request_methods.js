const originalValues = 'https://reqres.in/api/users';

// window.onload = async function (params) {
//     await fetchData();
// }

function displayNotification(message, status, statusCode) {
  let notificationDiv = document.getElementById('notification');
  
  // Create notification container if it doesn't exist
  if (!notificationDiv) {
    notificationDiv = document.createElement('div');
    notificationDiv.id = 'notification';
    document.body.appendChild(notificationDiv);
  }
  
  // Clear previous notifications
  notificationDiv.innerHTML = '';
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification-message ${status}-message`;
  notification.textContent = `${statusCode} - ${message}`;
  
  // Add to DOM
  notificationDiv.appendChild(notification);
  
  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.5s ease-in-out';
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

async function fetchData() {
        let defaultUserData = document.getElementById('originalData');
    try{
        let response = await fetch (originalValues);
        let data = await response.json();

        defaultUserData.innerHTML = `<h2>Original Data</h2>`;
        data.data.forEach(item => {
            let userDiv = `
            <div class = gallery>
            <img src= ${item.avatar} alt = 'User Avatar' style = 'width:100px; height: 100px; border-radius:50%;'/>
            <p>ID: ${item.id} </p>
            <p>Name: ${item.first_name} ${item.last_name} </p>
            <p>Email: ${item.email}</p>
            </div>`;
                        defaultUserData.innerHTML += userDiv
        })
    } catch (error){
        console.error("Failed to load data" +error );
    }
 
    
}

async function getData(event) {
    event.preventDefault();  // Prevent default form submission
    let id = document.getElementById('id');
    let updatedDataDiv = document.getElementById('updatedData');
    let originalDataDiv = document.getElementById('originalData');


    try {

        // Fetch existing users
        let response = await fetch(originalValues);
        let data = await response.json();

        if(response.ok){
            displayNotification("Data fetched successfully", "success", response.status);
        } else {
            displayNotification("Failed to fetch data", "error", response.status);
        }

        originalDataDiv.innerHTML = `<h2> Original Data </h2>`;
        data.data.forEach(item => {
            let userDiv = `
                <div class="gallery">
                    <img src="${item.avatar}" alt="User Avatar" style="width: 100px; height: 100px; border-radius: 50%;">    
                    <p>ID: ${item.id}</p>
                    <p>Name: ${item.first_name} ${item.last_name}</p>
                    <p>Email: ${item.email}</p>
                </div>`;
            originalDataDiv.innerHTML += userDiv;
        });

        let selectedUser = await fetch(originalValues + '/' + id.value);

        // if (!selectedUser.ok) {
        //     updatedDataDiv.innerHTML = `<p style = "color: red">Error! No user found with the ID</p>`;
        //     return;
        // }
        let selectedUserData = await selectedUser.json();
        let user = selectedUserData.data;
        if (id.value) {
            updatedDataDiv.innerHTML = `
            <h2> Get Request Data </h2>
            <div class = gallery>
            <img src = '${user.avatar}' alt = 'User Avatar' style = 'width: 100px; height: 100px; border-radius: 50%;'>
            <p>ID: ${user.id}</p>
            <p>Name: ${user.first_name} ${user.last_name}</p>
            <p>Email: ${user.email} </p>
            </div>`
       } //else {
        //     updatedDataDiv.innerHTML = `<p style = "color: red">Error! Please enter an ID</p>`;
        // }

    } catch (error) {
        console.log("Failed to load data: " + error);
    }
}

async function postData(event) {
    event.preventDefault();  // Prevent default form submission
    let originalDataDiv = document.getElementById('originalData');
    let updatedDataDiv = document.getElementById('updatedData');
    let firstNameInput = document.getElementById('first_name').value;
    let lastNameInput = document.getElementById('last_name').value;
    let emailInput = document.getElementById('email').value;
    let avatarInput = document.getElementById('avatar').value;
     
    if (!firstNameInput.trim() || 
    !lastNameInput.trim() || 
    !emailInput.trim() || 
    !avatarInput.trim()) {
    displayNotification("Bad Request: Please fill all required fields", "error", 400);
    return; // Stop execution if validation fails
}

    try {
        // Fetch existing users
        let response = await fetch(originalValues);
        let data = await response.json();

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
        originalDataDiv.innerHTML = `<h2> Original Data </h2>`;
        data.data.forEach(item => {
            let userDiv = `
                <div class="gallery">
                    <img src="${item.avatar}" alt="User Avatar" style="width: 100px; height: 100px; border-radius: 50%;">    
                    <p>ID: ${item.id}</p>
                    <p>Name: ${item.first_name} ${item.last_name}</p>
                    <p>Email: ${item.email}</p>
                </div>`;
            originalDataDiv.innerHTML += userDiv;
        });

        // Create new user
        let newUser = await fetch(originalValues + '/' + id.value, {
            method: 'POST',
            body: JSON.stringify({
                first_name: firstNameInput,
                last_name: lastNameInput,
                email: emailInput,
                avatar: avatarInput // Note: API does not store this, so use the input directly
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        let newUserData = await newUser.json();

      
            displayNotification("User added successfully", "success", response.status);
     
       
        // Display newly created user data
        updatedDataDiv.innerHTML = `
            <h2> POST Request Data </h2>
            <div class="gallery">
                <img src="${avatarInput}" alt="User Avatar" style="width: 100px; height: 100px; border-radius: 50%;">
                <p>ID: ${newUserData.id || "N/A"}</p>
                <p>Name: ${newUserData.first_name || firstNameInput} ${newUserData.last_name || lastNameInput}</p>
                <p>Email: ${newUserData.email || emailInput}</p>
            </div>`;

    } catch (error) {
        displayNotification("Failed to add user", error.message, response.status);
    }
}

async function putData(event) {
    event.preventDefault();  // Prevent default form submission
    
    let updatedDataDiv = document.getElementById('updatedData');
    let idInput = document.getElementById('id').value.trim();
    let firstNameInput = document.getElementById('first_name').value.trim();
    let lastNameInput = document.getElementById('last_name').value.trim();
    let emailInput = document.getElementById('email').value.trim();
    let avatarInput = document.getElementById('avatar').value.trim();
       // Ensure an ID is provided
       if (!idInput) {
        displayNotification("Error! You need to enter the ID of the data you want to modify.", "error", 400);
        return;
    }

    if (!firstNameInput || !lastNameInput || !emailInput) {
        displayNotification("Bad Request: All fields are required", "error", 400);
        return;
    }
    
 

    try {
        // Fetch the original user data to get the avatar
        let originalUserResponse = await fetch(originalValues + '/' + id.value);
        if(!originalUserResponse.ok){
            throw new Error(`HTTP error! Status: ${originalUserData.status}`);
        } 
        let originalUserData = await originalUserResponse.json();
        let userAvatar = originalUserData.data.avatar;  // Get existing avatar
        fetchData(); // Fetch original data to display it before updating

        // Prepare updated data (only include non-empty fields)
        let updatedFields = {};
        if (firstNameInput) updatedFields.first_name = firstNameInput;
        if (lastNameInput) updatedFields.last_name = lastNameInput;
        if (emailInput) updatedFields.email = emailInput;
        if (avatarInput) updatedFields.avatar = avatarInput;
        // PATCH request to update user data
        let response = await fetch(originalValues + '/' + id.value, {
            method: 'PATCH',
            body: JSON.stringify(updatedFields),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (!response.ok) {
            updatedDataDiv.innerHTML = `<p style="color: red;">Error! Failed to update user.</p>`;
            return;
        }

        let newUserData = await response.json();

        displayNotification("User updated successfully", "success", response.status);

        // Display updated user data
        updatedDataDiv.innerHTML = `
            <h2> PUT Request Data </h2>
            <div class="gallery">
                <img src="${userAvatar}" alt="User Avatar" style="width: 100px; height: 100px; border-radius: 50%;">
                <p><strong>ID:</strong> ${idInput}</p>
                <p><strong>Name:</strong> ${newUserData.first_name || originalUserData.data.first_name} ${newUserData.last_name || originalUserData.data.last_name}</p>
                <p><strong>Email:</strong> ${newUserData.email || originalUserData.data.email}</p>
            </div>`;

        console.log(newUserData);

    } catch (error) {
        console.error("Failed to load data: " + error);
        displayNotification("Failed to update user: " + error.message, "error", 500);
    }
}

async function patchData(event) {
    event.preventDefault();  // Prevent default form submission
    
    let updatedDataDiv = document.getElementById('updatedData');
    let idInput = document.getElementById('id').value.trim();
    let firstNameInput = document.getElementById('first_name').value.trim();
    let lastNameInput = document.getElementById('last_name').value.trim();
    let emailInput = document.getElementById('email').value.trim();
    let avatarInput = document.getElementById('avatar').value.trim();
    
        // Ensure an ID is provided
        if (!idInput) {
            displayNotification("Error! You need to enter the ID of the data you want to modify.", "error", 400);
            return;
        }

    if (!firstNameInput && !lastNameInput && !emailInput) {
        displayNotification("Bad Request: No modification made", "error", 400);
        return;
    }
    


    try {
        // Fetch the original user data to get the avatar
        let originalUserResponse = await fetch(originalValues + '/' + id.value);
        if(!originalUserResponse.ok){
            throw new Error(`HTTP error! Status: ${originalUserData.status}`);
        } 
        let originalUserData = await originalUserResponse.json();
        let userAvatar = originalUserData.data.avatar;  // Get existing avatar
        fetchData(); // Fetch original data to display it before updating

        // Prepare updated data (only include non-empty fields)
        let updatedFields = {};
        if (firstNameInput) updatedFields.first_name = firstNameInput;
        if (lastNameInput) updatedFields.last_name = lastNameInput;
        if (emailInput) updatedFields.email = emailInput;
        if (avatarInput) updatedFields.avatar = avatarInput;
        // PATCH request to update user data
        let response = await fetch(originalValues + '/' + id.value, {
            method: 'PATCH',
            body: JSON.stringify(updatedFields),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (!response.ok) {
            updatedDataDiv.innerHTML = `<p style="color: red;">Error! Failed to update user.</p>`;
            return;
        }

        let newUserData = await response.json();

        displayNotification("User updated successfully", "success", response.status);

        // Display updated user data
        updatedDataDiv.innerHTML = `
            <h2> PATCH Request Data </h2>
            <div class="gallery">
                <img src="${userAvatar}" alt="User Avatar" style="width: 100px; height: 100px; border-radius: 50%;">
                <p><strong>ID:</strong> ${idInput}</p>
                <p><strong>Name:</strong> ${newUserData.first_name || originalUserData.data.first_name} ${newUserData.last_name || originalUserData.data.last_name}</p>
                <p><strong>Email:</strong> ${newUserData.email || originalUserData.data.email}</p>
            </div>`;

        console.log(newUserData);

    } catch (error) {
        console.error("Failed to load data: " + error);
        displayNotification("Failed to update user: " + error.message, "error", 500);
    }
}

async function deleteData(event) {
    event.preventDefault();  // Prevent default form submission
    let updatedDataDiv = document.getElementById('updatedData');
    let idInput = document.getElementById('id').value;
   
        // Ensure an ID is provided
        if (!idInput) {
            displayNotification("Error! You need to enter the ID of the data you want to modify.", "error", 400);
            return;
        }


    try {
        
      fetchData();
        let response = await fetch(originalValues + '/' + id.value, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            if (response.ok) {

           
            updatedDataDiv.innerHTML = `
             <h2>User deleted successfully!</h2>
                <p style="color: green;">User with ID <strong>${idInput}</strong> has been deleted.</p>`;

            } else {
                updatedDataDiv.innerHTML = `<p style="color: red;">Error! Failed to delete user with ID ${idInput}.</p>`;
            }
           
       

    } catch (error) {
        displayNotification("Failed to update user: " + error.message, "error", 500);
    }
}