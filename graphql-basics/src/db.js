const demoComments = [{
  id: '1', 
  text: "this is Justin's comment",
  author: '1',
  post: '1'
},
{
  id: '2', 
  text: "this is Sarah's comment",
  author: '2',
  post: '3'
},
{
  id: '3', 
  text: "this is Mike's comment",
  author: '3',
  post: '2'
},
{
  id: '4', 
  text: "this is noone's comment",
  author: '3',
  post: '2'
}]

const demoUsers = [
  {
    id: '1', 
    name: 'Justin', 
    email: "justin@gmail.com",
    age: 12
}, 
{
  id: '2', 
  name: 'Sarah', 
  email: "sarah@gmail.com",
},
{
  id: '3', 
  name: 'mike', 
  email: "mike@gmail.com",
}
]
const demoPosts = [
  {
    id: '1', 
    title: 'post1', 
    body: "this is post1 sup hello",
    published: true,
    author: "1"
}, 
{
  id: '2', 
  title: 'post2', 
  body: "this is post 2 hello sir",
  published: true,
  author: "1"
},   {
  id: '3', 
  title: 'post3 sup', 
  body: "this is post3 sir sup",
  published: false,
  author: "2"
}
]

const db = {
  demoComments,
  demoPosts,
  demoUsers
}

export {db as default}