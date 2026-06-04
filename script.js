
//create variables to store html elements
const form = document.getElementById('form');
const textInput = document.getElementById('text-input');
const nameInput = document.getElementById('name-input');
const posts = document.getElementById('posts');
const postNames = document.getElementById('names');
const loading = document.getElementById('loader');

//variable to store the url of the backend server where we will send requests to get and create posts
const apiUrl = 'https://bulletin-board-8put.onrender.com/posts';


//function responsible for creating a new div element for each post and appending it to the posts element
function displayPosts(post) {
    const postElement = document.createElement('div');

    //set the innerHTML of the post element to include the message and name of the post
    postElement.innerHTML = `
        <p><strong>Message:</strong> ${post.message}</p>
        <p><strong>Written by:</strong> ${post.name}</p>
    `;
    postElement.setAttribute('class', 'post');
    posts.appendChild(postElement);
}



//function responsible for fetching posts from the backend server and displaying them on the page
async function fetchPosts() {
    try {
        loading.style.display = 'block'; //show the loading animation while fetching posts

        const response = await fetch(apiUrl);
        const savedPosts = await response.json();
        
        posts.innerHTML = '';

        savedPosts.forEach(function (post) {
            displayPosts(post);
        });

        console.log('Posts successfully loaded');

    } catch (error) {
        console.error('Error Loading posts:', error);
    } finally {
        loading.style.display = 'none'; //hide the loading animation after posts are loaded
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

        console.log('Post successfully created');

        textInput.value = '';
        nameInput.value = '';

    } catch (error) {
        console.error('Error creating post:', error);
    }
});

fetchPosts();



