
import db from "../db"

const Post = {
  author(parent, args, { db }, info) {
    const userID = parent.author 
    return db.demoUsers.find(user => {
      return user.id === userID
    })
  }, 
  comments(parent, args, { db }, info) {
    return db.demoComments.filter(comment => {
      return comment.post === parent.id
    })
  }
} 

export { Post as default }