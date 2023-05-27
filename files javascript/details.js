window.onload = updateUi();
// GET DETAILS POST*************************************************
const urlParams = new URLSearchParams(window.location.search); 
const idParam = urlParams.get("postId");
function getPost() {
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${idParam}`)
        .then(function (response) {
            // console.log(response)
            let posts = response.data.data;
            // console.log(posts)
            document.getElementById("posts").innerHTML = "";
            let comments = posts.comments
            // console.log(comments)
            let showComments = ``;
            for (comment of comments) {
                // console.log(comment)
                showComments += `
                
                        <div class="comment">
                            <img src=${comment.author.profile_image} alt="" class="rounded-circle" style="width:50px;height:50px; margin-right:10px">
                            <span style="font-weight: bold;">${comment.author.username}</span>
                            <p style="color:#777">${comment.body}.</p><hr>
                        </div>
                    
                `
            }
            let containPost = `
                <h2 class="nameUserPost">${posts.author.username}</h2>
                <!-- POST -->
                <div class="post shadow"> 
                    <div class="card" style="margin-top: 30px;">
                        <div class="card-header">
                            <img src=${posts.author.profile_image} class="rounded-circle"
                                style="width: 40px; height: 40px; border: 3px solid #fff">
                            <b>${posts.author.username}</b>
                        </div>
                        <div class="card-body">
                            <img src=${posts.image} class="w-100">
                            <h6 style="color: #777; margin-top:10px;">${posts.created_at}</h6>
                            <h5 class="card-title">${posts.title}</h5>
                            <p class="card-text">${posts.body}</p>
                            <hr>

                            <svg style="color:#0d6efd" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                <path
                                    d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                            </svg>
                            <span>(${posts.comments_count}) Comments</span>
                        </div>
                    </div>
                    <div class="comments p-3">
                        ${showComments}
                    </div>
                    <div class="addComment d-flex justify-content-between" id="hide-comment">
                        <input type="text" placeholder="add your comment..." id="addcomment" class="border-0">
                        <button class="border-0 bg-primary text-white" id="send" onclick="addComents()">Send</button>
                    </div>
                </div>
            `
            document.getElementById("posts").innerHTML = containPost;
        })
}
getPost();
// //////////////////////////////////////////////////////////
function uiAddComment() {
    let token = localStorage.getItem("token");
    if (token == null){
        document.getElementById("hide-comment").style.setProperty("display", "none", "important");
    }else{
        document.getElementById("hide-comment").style.setProperty("display", "block", "important");

    }
    getPost();
}
uiAddComment();
// add new comment
function addComents() {
    let input = document.getElementById("addcomment").value;
    let params = {
        "body": input
    };
    let token = localStorage.getItem("token");
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${idParam}/comments`, params, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })
    .then(function (response) {
        console.log(response.data)
        getPost()

    })
    .catch((error) => {
        alertDangerComment();
    })
}


// /////////////////////////////////////////////////////////////////////////////////////////////





// LOGIN USER********************************************
function loginUser() {
    let username = document.getElementById("recipient-name").value;
    let password = document.getElementById("message-text").value;
    let param = {
        "username": username,
        "password": password
    }
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
        })
        removeValueInput();
        closeModalLogin();

}

// REGISTER USER*************************************
function registerBtnClick() {
    
    let username = document.getElementById("username").value;
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    const image = document.getElementById("img-prof").files[0];

    let formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image);

    const headers = {
        "Content-Type": "multipart/form-data",
    };
    axios.post('https://tarmeezacademy.com/api/v1/register', formData, {
        headers: headers
    })
        .then((response) => {
            console.log(response)
            showAlert('Registered in  Successfully!', 'success');
            
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            
            updateUi();
        }) .catch((error) => {
            const message = error.response.data.message;
            showAlert(message, 'danger');
        });
        removeValueInput();
        closeModalRegister();
        
};

// LOGOUT USER****************************************************
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showAlert('Logged out successfully!', 'success');
    updateUi();
    
}







function getCurrentUser() {
    let user = null;
    const storageUser = localStorage.getItem("user");
    if(storageUser != null){
        user = JSON.parse(storageUser);
    }
    return user;
    
}





// ***********************All dinamic Functions***************************//

// 1- remove value input******************************
function removeValueInput() {
    document.getElementById("recipient-name").value = '';
    document.getElementById("message-text").value = '';
    document.getElementById("username").value = '';
    document.getElementById("name").value = '';
    document.getElementById("email").value = '';
    document.getElementById("password").value = '';
}

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
// close modal login
function closeModalLogin() {
    let closeModal = bootstrap.Modal.getInstance("#login-modal");
    closeModal.hide();
}
// close modal register
function closeModalRegister() {
    let closeModal = bootstrap.Modal.getInstance("#register-modal");
    closeModal.hide();
}
// close modal create post
function closeModalpost() {
    let postModal = document.getElementById("addPost");
    let closeModal = bootstrap.Modal.getInstance(postModal); 
    closeModal.hide();
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











