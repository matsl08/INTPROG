const originalValues = 'https://reqres.in/api/users';

window.onload = async function (params) {
    await fetchData();
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
    try {
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
        } else {
            updatedDataDiv.innerHTML = `<p style = "color: red">Error! Please enter an ID</p>`;
        }

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
     
    if (!firstNameInput || !lastNameInput || !emailInput|| !avatarInput) {
        updatedDataDiv.innerHTML = `<p style="color: red;">Error! All fields are required except ID.</p>`;
        return;
    }

    try {
        // Fetch existing users
        let response = await fetch(originalValues);
        let data = await response.json();

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

        // Display newly created user data
        updatedDataDiv.innerHTML = `
            <h2> POST Request Data </h2>
            <div class="gallery">
                <img src="${avatarInput}" alt="User Avatar" style="width: 100px; height: 100px; border-radius: 50%;">
                <p>ID: ${newUserData.id || "N/A"}</p>
                <p>Name: ${newUserData.first_name || firstNameInput} ${newUserData.last_name || lastNameInput}</p>
                <p>Email: ${newUserData.email || emailInput}</p>
            </div>`;

            let result = [...originalDataDiv, ...newUserData];
        console.log(result);
    } catch (error) {
        console.log("Failed to load data: " + error);
    }
}


async function putData(event) {
    event.preventDefault();  // Prevent default form submission
    let originalDataDiv = document.getElementById('originalData');
    let updatedDataDiv = document.getElementById('updatedData');
    let idInput = document.getElementById('id').value;
    let firstNameInput = document.getElementById('first_name').value;
    let lastNameInput = document.getElementById('last_name').value;
    let emailInput = document.getElementById('email').value;
     
    if (!firstNameInput || !lastNameInput || !emailInput ) {
        updatedDataDiv.innerHTML = `<p style="color: red;">Error! All fields are required.</p>`;
        return;
    }

    if (!idInput) {
        updatedDataDiv.innerHTML = `<p style="color: red;">Error! You need to enter the ID of the data you want to modify</p>`;
        return;
    }

    try {
        let originalUserData = await fetch(originalValues);

        let data = await originalUserData.json();
        // originalData.innerHTML = ''; // Clear previous content
        originalDataDiv.innerHTML = "";  
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

      
        let newUser = await fetch(originalValues + '/' + id.value, {
                method: 'PUT',
                body: JSON.stringify({
                    id: idInput,
                    first_name: firstNameInput,
                    last_name: lastNameInput,
                    email: emailInput
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            let newUserData = await newUser.json();
            // let user = newUserData.data;
            updatedDataDiv.innerHTML = `
            <h2> PUT Request Data </h2>
            <div class = gallery>
            <img src = '${newUserData.avatar}' alt = 'User Avatar' style = 'width: 100px; height: 100px; border-radius: 50%;'>
            <p>ID: ${newUserData.id}</p>
            <p>Name: ${newUserData.first_name} ${newUserData.last_name}</p>
            <p>Email: ${newUserData.email} </p>
            </div>`
            console.log(newUserData);
       

    } catch (error) {
        console.log("Failed to load data: " + error);
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
        updatedDataDiv.innerHTML = `<p style="color: red;">Error! You need to enter the ID of the data you want to modify.</p>`;
        return;
    }

    try {
        // Fetch the original user data to get the avatar
        let originalUserResponse = await fetch(originalValues + '/' + id.value);
        if (!originalUserResponse.ok) {
            updatedDataDiv.innerHTML = `<p style="color: red;">Error! No user found with the ID ${idInput}.</p>`;
            return;
        }
        let originalUserData = await originalUserResponse.json();
        let userAvatar = originalUserData.data.avatar;  // Get existing avatar

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
        updatedDataDiv.innerHTML = `<p style="color: red;">Failed to update data: ${error}</p>`;
        console.error("Failed to send PATCH request:", error);
    }
}

async function deleteData(event) {
    event.preventDefault();  // Prevent default form submission
    let updatedDataDiv = document.getElementById('updatedData');
    let idInput = document.getElementById('id').value;
   
    if (!idInput) {
        updatedDataDiv.innerHTML = `<p style="color: red;">Error! You need to enter the ID of the user you want to delete</p>`;
        return;
    }

    try {
      
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
        console.log("Failed to delete data: " + error);
    }
}