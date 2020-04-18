const posts  = [
    {title:"killing yourself",content:"okay just kill yourself"},
    {title:"killing people",content:"okay just kill people"}
]

function getPosts(posts){
    setTimeout(()=>{
        let output = '';
        posts.forEach(post => {
            output += `<li>${post.title}</li>`
        });
        document.body.innerHTML = output;
    },1000)
}
