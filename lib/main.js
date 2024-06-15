const express = require('express')
const app = express()
const authRouter = require('./features/auth/routes/auth')
const adminRouter = require('./features/admin/routes/admin_actions')
const engagmentRouter = require('./features/engage/routes/engage')


app.use(express.json())
app.use('/auth',authRouter);
app.use('/admin', adminRouter);
app.use('/engage', engagmentRouter);

let PORT = 5000
let host = '127.0.0.1'

app.get('/', (_,res) => {
    res.send('Welcome To A Hackathon Regestrations Api!')
})

app.listen(PORT,host,() => {
    let url = `http://${host}:${PORT}/`
    console.log(`Listening from ${url}`);
})