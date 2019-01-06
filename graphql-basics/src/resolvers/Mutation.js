import uuidv4 from "uuid"
import db from "../db"

const Mutation = {
  updateComment(parent, args, { db, pubsub}, info) {
    const {data, id} = args
    const comment = db.demoComments.find(comment => comment.id === id)
    if (!comment) {
      throw new Error('Comment doesnt exist')
    }
    if (typeof data.text === 'string') {
      comment.text = data.text
    }
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: `UPDATED`, 
        data: comment
      }
    })
    return comment
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const {data, id} = args
    const post = db.demoPosts.find(post =>  post.id === id)
    const originalPost = {...post}
    if (!post) {
      throw new Error('Post doesnt exist')
    }
    if (typeof data.title === 'string') {
      post.title = data.title
    }
    if (typeof data.body === 'string') {
      post.body = data.body
    }
    if (typeof data.published === 'boolean') {
      post.published = data.published
      if (originalPost.published && !post.published) {
        // deleted
        pubsub.publish(`post`, {
          post: {
            mutation: 'DELETED', 
            data: originalPost
          }
        })
       } else if (!originalPost.published && post.published) {
         // created
         pubsub.publish(`post`, {
           post: {
             mutation: 'CREATED',
             data: post
           }
         })
       } else if (post.published) {
         // updated
         pubsub.publish(`post`, {
          post: {
            mutation: 'UPDATED',
            data: post
          }
        })

       }
    }

    return post
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args
    const user = db.demoUsers.find(user => user.id === id)
    if (!user) {
      throw new Error('User not found')
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.demoUsers.some(user => user.email === data.email)
      if (emailTaken) {
        throw new Error('Email is taken!')
      }
      user.email = data.email
    }
    if (typeof data.name === 'string') {
      user.name = data.name
    }
    
    if (typeof data.age !== 'undefined') {
      user.age = data.age
    }
    return user
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIdx = db.demoComments.findIndex(comment => comment.id === args.id)
    if (commentIdx === -1) {
      throw new Error("comment does not exist")
    }
    const [comment] = db.demoComments.splice(commentIdx, 1)
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED', 
        data: comment
      }
    })
    return comment
  },
  deletePost(parent, args, { db, pubsub}, info) {
    const postIdx = db.demoPosts.findIndex(post => post.id === args.id)
    if (postIdx === -1) {
      throw new Error('The post you are trying to delete does not exist')
    }
  
    const [post] = db.demoPosts.splice(postIdx, 1)
    db.demoComments = db.demoComments.filter(comment => comment.post !== args.id)
    if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: 'DELETED', 
          data: post
        }
      })
    }
    return post
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.demoUsers.findIndex(user => user.id === args.id)
    if (userIndex === -1) {
      throw new Error('User is not here')
    }
    const deletedUsers = db.demoUsers.splice(userIndex, 1)
    // remove associated posts. 
    db.demoPosts = db.demoPosts.filter(post => {
      const match = post.author === args.id
      // Remove comments associated with the post.
      if (match) {
        db.demoComments = db.demoComments.filter(comment => comment.post !== post.id)
      }
      return !match
    })
    // remove associated comments.
    db.demoComments === db.demoComments.filter(comment => comment.author !== args.id)
    return deletedUsers[0]

  },
  createUser(parent, args, { db }, info) {
    const emailTaken = db.demoUsers.some(user => user.email === args.data.email)
    if (emailTaken) {
      throw new Error('Email is already taken!')
    }
    const user = {
      id: uuidv4(),
      ...args.data
    }
    db.demoUsers.push(user)
    return user
  }, 
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.demoUsers.some(user => user.id === args.data.author)
    if (!userExists) {
      throw new Error('User not found')
    }
    const post = {
      id: uuidv4(),
      ...args.data
    }
    db.demoPosts.push(post)
    if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: 'CREATED', 
          data: post
        }
       })
    }
    return post
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.demoUsers.some(user => user.id === args.data.author)
    if (!userExists) {
      throw new Error('User not found')
    }
    const postExists = db.demoPosts.some(curPost => curPost.id === args.data.post && curPost.published)
    if (!postExists) {
      throw new Error('Post not found')
    }
    const comment = {
      id: uuidv4(), 
      ...args.data
    }
    db.demoComments.push(comment)
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: `CREATED`, 
        data: comment
      }
    })
    return comment
  }
}

export {Mutation as default}