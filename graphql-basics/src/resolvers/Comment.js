import db from "../db"

const Comment = {
  author(parent, args, { db }, info) {
    return db.demoUsers.find(user => {
      return user.id === parent.author
    })
  },
  post(parent, args, { db }, info) {
    return db.demoPosts.find(post => {
      return post.id === parent.post
    })
  }
}

export {Comment as default}