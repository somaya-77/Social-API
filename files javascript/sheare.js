

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
        })
        removeValueInput();
        closeModalLogin();
}

// create post on page
function addPostOnPage() {
    const title = document.getElementById("title-post").value;
    const body = document.getElementById("body-post").value;
    const image = document.getElementById("image-post").files[0];
    const token = localStorage.getItem("token");
    let postId = document.getElementById("edit-post").value;
    let isCreate = postId == null || postId == "";

    let formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("image", image);

    
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    };

    if(isCreate){

        axios.post('https://tarmeezacademy.com/api/v1/posts', formData, {
            headers: headers,
        }).then((response) => {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }).catch((error) => {
            const message = error.response.data.message;
            showAlert(message, 'danger');
        });
        updateUi();

    }else {

        formData.append("_method", "put");
        axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}`, formData, {
        headers: headers,
        }).then((response) => {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }).catch((error) => {
            const message = error.response.data.message;
            showAlert(message, 'danger');
        });
    }

    getPosts();
    closeModalpost();
    updateUi();
}
// close modal create post
function closeModalpost() {
    let postModal = document.getElementById("addPost");
    let closeModal = bootstrap.Modal.getInstance(postModal); 
    closeModal.hide();
}