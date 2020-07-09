import express from 'express'
const path = require('path')
const app = express()
const morgan = require('morgan')
const sqlite3 = require('sqlite3').verbose()

const userRoute = require('./routes/users')

app.set('port', process.env.PORT || 3000)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: false}))
app.use(morgan('dev'))

let db = new sqlite3.Database('users.db', (err) => {
    if(err) return console.error(err)
    console.log('Running DataBase')
})
db.serialize(() => {
    db.run('CREATE TABLE if not exists users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, last_name TEXT, dni INT, birth_day TEXT)')
})
app.use('/', userRoute)


app.listen(app.get('port'), () => {
    console.log('Server Running')
})
