
//create variables to store html elements
const form = document.getElementById('form');
const textInput = document.getElementById('text-input');
const nameInput = document.getElementById('name-input');
const posts = document.getElementById('posts');
const postNames = document.getElementById('names');

//variable to store the url of the backend server where we will send requests to get and create posts
const apiUrl = 'http://localhost:3000/posts';


function displayPosts(post) {
    const postElement = document.createElement('div');
    postElement.innerHTML = `
        <p><strong>Message:</strong> ${post.message}</p>
        <p><strong>Written by:</strong> ${post.name}</p>
    `;
    postElement.setAttribute('class', 'post');
    posts.appendChild(postElement);
}




async function fetchPosts() {
    try {
        const response = await fetch(apiUrl);
        const savedPosts = await response.json();

        console.log(savedPosts);
        
        posts.innerHTML = '';

        savedPosts.forEach(function (post) {
            displayPosts(post);
        });
    } catch (error) {
        console.error('Error Loading posts:', error);
    }
}



//add event listener to execute code when form is submitted 
form.addEventListener('submit', async function (event) {

    //prevents page from refreshing when form is submitted
    event.preventDefault();

    //create variables to store values from the text and name input fields
    const text = textInput.value;
    const name = nameInput.value;

    //if either input fields are empty, alert user to fill both fields and stop execution of code
    if (text == "" || name == "") {
        alert("Please fill in both fields.");
        return;
    }

    //create a variable to store a new div element that will contain the post and name
    const newPost = {
        message: text,
        name: name
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPost)
        });

        if (!response.ok) {
            throw new Error('Error creating post');
        }

        const savedPost = await response.json();

        displayPosts(savedPost);

        textInput.value = '';
        nameInput.value = '';

    } catch (error) {
        console.error('Error creating post:', error);
    }
});

fetchPosts();

