import db from "../db"

const Query = {
  comments() {
    return db.demoComments
  },
  me() {
    return {
      id: 123,
      name: "Justin", 
      email: "em",
      age: 21
    }
  }, 
  post() {
    return {
      id: 123, 
      title: "NEW POST", 
      body: "BODY", 
      published: true
    }
  },
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.demoUsers
    }
    return db.demoUsers.filter(user => {
      return user.name.toLowerCase().includes(args.query.toLowerCase())
    })
  }, 
  posts(parent, {query}, { db}, info) {
    if (!query)  {``
      return db.demoPosts
    }
    return db.demoPosts.filter(post => {
      return post.title.toLowerCase().includes(query.toLowerCase()) || 
        post.body.toLowerCase().includes(query.toLowerCase())
    })
  }

}

export {Query as default }