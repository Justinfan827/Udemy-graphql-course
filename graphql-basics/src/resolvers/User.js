import db from "../db"

const User = {
  posts(parent, args, { db }, info) {
    return db.demoPosts.filter(post => {
      return post.author === parent.id
    }) 
  },
  comments(parent, args, { db }, info) {
    return db.demoComments.filter(comment => {
      return comment.author === parent.id
    })
  }
}

export {User as default }