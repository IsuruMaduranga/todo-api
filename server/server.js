const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true })

const Todo = mongoose.model('Todo',{
    text:{type:String, required:true, minlength:1, trim:true},
    completed:{type:Boolean, default:false},
    completedAt:{type:Number, default:null}
})

const User =  mongoose.model('User',{
    name:{type:String,required:true,minlength:1,trim:true},
    email:{type:String,required:true,minlength:1,trim:true}
})

let todo = new Todo({
    text: 'Go shopping',
    completed: false,
    completedAt: 894949
})

todo.save().then(
    doc=>console.log('Saved todo',doc),
    e=>console.log('Uanble to save todo')
)

let user = new User({
    name:'Isuru Maduranga',
    email:'isurumaduranga.official@gmail.com'
})

user.save().then(
    doc=>console.log('Saved todo',doc),
    e=>console.log('Uanble to save user')
)