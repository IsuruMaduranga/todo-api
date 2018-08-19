const expect = require('expect')
const request = require('supertest')
const {ObjectID} =  require('mongodb')

const {app}=require('./../server')
const {Todo}=require('./../models/todo')

const todos = [
    {_id:new ObjectID(),text: 'First todo'},
    {_id:new ObjectID(),text: 'Second todo',completed: true,completedAt:333}
]

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos)
    }).then(()=>done())
})

describe('POST /todos',()=>{
    it('should create a new todo',(done)=>{
        const text =  'Sample text'

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text)
        })
        .end((err,res)=>{
            if(err){
                return done(err)
            }

            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1)
                expect(todos[0].text).toBe(text)
                done()
            }).catch(e=>done(e))
        })
    })

    it('should not ceate todo with invalid data',(done)=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err){
                return done(err)
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2)
                done()
            }).catch(e=>done(e))
        })
    })
})

describe('Get /todos',()=>{
    it('should get all todos',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2)
        })
        .end(done)
    })
})

describe('GET /todos/:id',()=>{
    it('should return specific todo',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect(res=>{
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done)
    })

    it('should return 404 if todo is not found',(done)=>{
        request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done)
    })

    it('should return 404 for invalid object IDs',(done)=>{
        request(app)
        .get('/todos/12345')
        .expect(404)
        .end(done)
    })
})

describe('DELETE /todo/:id',()=>{
    it('should remove a todo',(done)=>{
        const hexID = todos[0]._id.toHexString()
        request(app)
        .delete(`/todos/${hexID}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexID)
        })
        .end((err,res)=>{
            if(err){
                return done(err)
            }

            Todo.findById(hexID).then(todo=>{
                expect(todo).toNotExist()
                done()
            }).catch(e=>done(e))
        })
    })

    it('should return 404 if todo not found',(done)=>{
        request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done)
    })

    it('should return 404 for invalid object IDs',(done)=>{
        request(app)
        .delete('/todos/1234')
        .expect(404)
        .end(done)
    })
})

describe('PATCH /todos/:id',()=>{
    it('should update the todo',(done)=>{
        const hexID =  todos[0]._id.toHexString()
        const text = 'text from test'

        request(app)
        .patch(`/todos/${hexID}`)
        .send({
            completed: true,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(true)
            expect(res.body.todo.completedAt).toBeA('number')
        })
        .end(done)
    })

    it('should clear completed at when todo is not completed',(done)=>{
        const hexID =  todos[0]._id.toHexString()
        const text = 'text from test'

        request(app)
        .patch(`/todos/${hexID}`)
        .send({
            completed: false,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(false)
            expect(res.body.todo.completedAt).toNotExist()
        })
        .end(done)
    })

    it('should return 404 if todo not found',(done)=>{
        request(app)
        .patch(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done)
    })

    it('should return 404 for invalid object IDs',(done)=>{
        request(app)
        .patch('/todos/1234')
        .expect(404)
        .end(done)
    })
})