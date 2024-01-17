const nodemailer = require("nodemailer");
const Mailgen = require('mailgen');

const { EMAIL, PASSWORD} = require('../env.js')
/** send email from testing account */
const signup = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let message = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Thank u for joining us", // plain text body
    html: "<b>Thank u for joining us</b>", // html body
  }

  transporter.sendMail(message).then((info)=>{
    return res.status(201).json({
        msg:"you should receive an email",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info)
    })
  }).catch(error =>{
    return res.status(500).json({error})
  })

  //res.status(201).json("Signup successfully...!");
};

/** send email from a real gmail account */
const getbill = (req, res) => {

    const { userEmail} = req.body;

    let config = {
        service: 'gmail',

        auth:{
            user:'EMAIL',
            pass: 'PASSWORD'
        }
    }

    let transporter = nodemailer.createTransport(config)

    let MailGenerator = new Mailgen({
        theme:"default",
        product:{
            name:"Mailgen",
            link:'https://mailgen.js/'
        }
    })

    let response = {
        body: {
            name: "Calendara",
            intro:"Your bill has arrived!",
            table:{
                data:[
                    {
                    item: "Nodemailer Stack Book",
                    description:"A backend application",
                    price:"$69.69",
                    }
                ]
            },
            outro:"Looking forward to do more business!"
        }
    }

    let mail = MailGenerator.generate(response)

    let message = {
        from : EMAIL,
        to : userEmail,
        subject : "Event Created",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg:"You should receive an email!"
        })
    }).catch( error => {
        return res.status(500).json({error})
    })


  //res.status(201).json("GetBill successfully...!");
};

module.exports = {
  signup,
  getbill,
};
