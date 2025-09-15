fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(data => displayPosts(data))
    .catch(error => console.log(error));
function displayPosts(posts) {
    posts.forEach((p, i) => {
        document.getElementById('posts').innerHTML += singlePost(p.title, i)
    })
}

function singlePost(title, index) {
    return `<div class="post">
                <a href="https://jsonplaceholder.typicode.com/posts/${index + 1}">${title}</a>
            </div>`
}