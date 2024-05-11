const express = require('express');
require('dotenv').config()
const morgan = require('morgan')
const recipesRoutes = require('./routes/recipes');
const usersRoutes = require('./routes/users');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const AuthMiddleware = require('./middlewares/AuthMiddleware');
const cron = require('node-cron');
const User = require('./models/User');
const nodemailer = require("nodemailer");

const app = express();
app.use(express.static('public'))
const mongoURL = "mongodb+srv://hlaingminthan:test1234@mern-cluster.cut3lbf.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(mongoURL).then(() => {
    console.log('connected to db');
    app.listen(process.env.PORT,() => {
        console.log('app is running on localhost:'+process.env.PORT);
        cron.schedule('*/4 * * * * *',async () => {
           let user = await User.findByIdAndUpdate('6606c41539c9b946de4c5e41', {
                name : "mgmg "+Math.random()
           });
        });
    })
});
app.use(cors(
    {
        origin : "http://localhost:5173",
        credentials : true
    }
));//local development --WARNING---
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

app.get('/', (req,res) => {
    return res.json({hello : 'world'});
});

app.use('/api/recipes',AuthMiddleware,recipesRoutes)
app.use('/api/users',usersRoutes)

app.get('/set-cookie',(req,res) => {
    // res.setHeader('Set-Cookie','name=hlaingminthan');
    res.cookie('name','aungaung');
    res.cookie('important-key','value', {httpOnly : true});
    return res.send('cookie already set');
})

app.get('/send-email',async (req,res) => {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "00d6486c058ca5",
          pass: "5235312898201a"
        }
      });

      const info = await transport.sendMail({
        from: 'mgmg@gmail.com', // sender address
        to: "hlaingminthan@gmail.com", // list of receivers
        subject: "Hello This is email title", // Subject line
        html: "<h1>Hello world this is email to hlaingminthan</h1>", // html body
      });
    
      console.log("Message sent: %s", info.messageId);

      return res.send('email already sent');
})

app.get('/get-cookie',(req,res) => {
    let cookies = req.cookies;
    return res.json(cookies);
})