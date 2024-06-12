const express = require('express')
const app = express()
const authRouter = require('./features/auth/routes/auth')


app.use(express.json())
app.use('/auth',authRouter);

let PORT = 5000
let host = '127.0.0.1'

app.get('/', (_,res) => {
    res.send('Welcome To A Hackathon Regestration Api!')
})

app.listen(PORT,host,() => {
    let url = `http://${host}:${PORT}/`
    console.log(`Listening from ${url}`);
})