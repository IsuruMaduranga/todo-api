const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true })

const Todo = mongoose.model('Todo',{
    text:{type: String},
    completed:{type:Boolean},
    completedAt:{type:Number}
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