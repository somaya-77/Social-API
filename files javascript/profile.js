window.onload = updateUi();
function updateUi() {
    let divButtons = document.getElementById("btnRequst");
    let logoutBtn = document.getElementById("logout-div");
    let token = localStorage.getItem("token");
    if (token != null) { 
        divButtons.style.setProperty("display", "none", "important");
        logoutBtn.style.setProperty("display", "flex", "important");
        let dataUser = getCurrentUser();
        document.getElementById("show-name").innerHTML = dataUser.username;
        document.getElementById("img-profile").src = dataUser.profile_image;
    } else {
        divButtons.style.setProperty("display", "flex", "important");
        logoutBtn.style.setProperty("display", "none", "important");
    }
}


function getCurrentUser() {
    let user = null;
    const storageUser = localStorage.getItem("user");
    if(storageUser != null){
        user = JSON.parse(storageUser);
    }
    return user;
}
function getCurrentId(){
    const urlParams = new URLSearchParams(window.location.search)
    const idParam = urlParams.get("userid");
    return idParam
}

function getUser() {
    const id = getCurrentId();
    loaderRequst(true)
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`) 
        .then((response) => {
            loaderRequst(false)
            const User = response.data.data;
            document.getElementById("header-image").src = User.profile_image;
            document.getElementById("main-info-name").innerHTML = User.name;
            document.getElementById("main-info-username").innerHTML = User.username;
            document.getElementById("main-info-email").innerHTML = User.email;
            document.getElementById("count-posts").innerHTML = User.posts_count;
            document.getElementById("count-comments").innerHTML = User.comments_count;
            document.getElementById("userPosts").innerHTML = User.name;
        })
}
getUser();

function getPosts() {
    const id = getCurrentId();
    loaderRequst(true)
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
        .then((response) => {
            loaderRequst(false)
            let posts = response.data.data;
            document.getElementById("posts-user").innerHTML = "";
            for (post of posts) {
                let postTitle = "";
                let user = getCurrentUser();
                let isMyPost = user != null && post.author.id == user.id;

                let editBtn = ``;
                if(isMyPost){
                    editBtn = `
                    <button class="btn btn-danger" style="float: right; margin-left: 10px;" onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
                    <button class="btn btn-secondary" style="float: right;" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
                    `;
                }
                if (post.title != null) {

                    postTitle = post.title;
                }
                let containPost = `
                    <div class="post shadow">
                        <div class="card" style="margin-top: 30px;">
                            <div class="card-header">
                                <img onclick="userClicked(${post.author.id})" src=${post.author.profile_image} class="rounded-circle" style="cursor: pointer; width: 40px; height: 40px; border: 3px solid #fff">
                                <b onclick="userClicked(${post.author.id})" style="cursor: pointer;">${post.author.username}</b>
                                ${editBtn}
                            </div>
                            <div class="card-body" onclick="showPost(${post.id})" style="cursor:pointer">
                                <img src=${post.image} class="w-100">
                                <h6 style="color: #777; margin-top:10px;">${post.created_at}</h6>
                                <h5 class="card-title">${postTitle}</h5>
                                <p class="card-text">${post.body}</p>
                                <hr>
                                
                                <svg style="color:#0d6efd" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                                </svg>
                                <span>(${post.comments_count}) Comments</span>
                            </div>
                        </div>
                    </div>
                `
                document.getElementById("posts-user").innerHTML += containPost;
            };
        });
};
getPosts();

// ///////////////////////////////////////////////
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showAlert('Logged out successfully!', 'success');
    updateUi();
    
}


// LOGIN USER********************************************
function loginUser() {
    let username = document.getElementById("recipient-name").value;
    let password = document.getElementById("message-text").value;
    let param = {
        "username": username,
        "password": password
    }
    loaderRequst(true)
    axios.post('https://tarmeezacademy.com/api/v1/login', param)
    .then((response) => {
        showAlert('Logged in  Successfully!', 'success');
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        updateUi();
    })
    .catch((error) => {
        const message = error.response.data.message;
        showAlert(message, 'danger');
    }).finnaly(()=>{
        loaderRequst(false)
    })
    removeValueInput();
    closeModalLogin();

}

// close modal login
function closeModalLogin() {
    let closeModal = bootstrap.Modal.getInstance("#login-modal");
    closeModal.hide();
}

// 1- remove value input******************************
function removeValueInput() {
    document.getElementById("recipient-name").value = '';
    document.getElementById("message-text").value = '';
    document.getElementById("username").value = '';
    document.getElementById("name").value = '';
    document.getElementById("email").value = '';
    document.getElementById("password").value = '';
}

// message, type            /** true */
function showAlert(text,type) {
    const alertPlaceholder = document.getElementById('alert');
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    appendAlert(text, type);

    setTimeout(() => {
        const alertHide = bootstrap.Alert.getOrCreateInstance('#alert')
        //alertHide.close()  // todo
    },3000)
}


// function edit
function editPost(objectPost){
    let post = JSON.parse(decodeURIComponent(objectPost));
    
    document.getElementById("edit-post").value = post.id;
    document.querySelector(".modal-header h5").innerHTML = "Edit Post"; // ?????????????????
    document.getElementById("editPost").innerHTML = "Update"; 
    document.getElementById("title-post").value = post.title; 
    document.getElementById("body-post").value = post.body; 
    let modal = new bootstrap.Modal(document.getElementById("addPost"), {});
    modal.toggle();
   
}

// function deletePost
function deletePost(objectPost){
    let post = JSON.parse(decodeURIComponent(objectPost));
    document.getElementById("delete-post-input").value = post.id;
    let modal = new bootstrap.Modal(document.getElementById("delete-modal"), {});
    modal.toggle();
}
// confirmDelete
function confirmDelete(){
    const postIdDelete = document.getElementById("delete-post-input").value;
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    };
    loaderRequst(true)
    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postIdDelete}`, {
        headers:  headers
        })
        .then((response) => {

            closeModalDeletepost();
            showAlert('Logged in  Successfully!', 'success');
            updateUi();
            getPosts();
        })
        .catch((error) => {
            const message = error.response.data.message;
            showAlert(message, 'danger');
        }).finnaly(()=>{
            loaderRequst(false)
        })
        removeValueInput();
        closeModalLogin();
}
// close modal Delete post
function closeModalDeletepost() {
    let postModal = document.getElementById("delete-modal");
    let closeModal = bootstrap.Modal.getInstance(postModal); 
    closeModal.hide();
}

function userClicked(userId){
    
    window.location = `../files html/profile.html?userid=${userId}`
}

function profileClicked(){
    let user = getCurrentUser();
    const userId = user.id;
    window.location = `../files html/profile.html?userid=${userId}`

}


function loaderRequst(show = true){
    if(show){
        document.querySelector(".parent-loader").style.visibility = 'visible';
    }else{
        document.querySelector(".parent-loader").style.visibility = 'hidden';
    }
}