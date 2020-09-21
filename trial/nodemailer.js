const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    type: "login",
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

console.log(token);

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("here = " + error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

let message = {
  from: process.env.GMAIL_USER,
  to: "sthasuraj2@gmail.com",
  subject: "TEST HTML6",
  html: ` <html>
	            <head>
                <style>
                    p.custom {
                        font-family: "Muli", sans-serif;
                        font-size: 20px;
                        line-height: 1.5;
                    }

                    h1.custom {
                        font-family: "Libre Baskerville", serif;
                        font-size: 2.5em;
                        font-weight: bold;
                        justify-content: center;
                    }

                    div.container {
                        margin: 10vh 5vw;
                        display: flex;
                        justify-content: center;
                    }

                    div.custom {
                        padding: 35px;
                        display: grid;
                        /* justify-content: center; */
                        border-style: solid;
                        border-color: #000000;
                        border-radius: 1em;
                        min-width: 80%;
                    }
                </style>
            </head>
            <body>
                <link
                    href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Muli:wght@400;700&display=swap"
                    rel="stylesheet"
                />
                <div class="container">
                    <div class="custom">
                        <h1 class="custom">Confirm your e-mail address</h1>
                        <p class="custom">
                            Dear <strong>$(req.body.username)</strong>,<br />
                            Please cofirm <strong>'$(req.body.email)'</strong> as your email by following clicking the
                            following link:<br />
                            <a href="http:\/\/$(req.headers.host)\/confirmation\/$(token.token)">
                                <strong>Click here</strong></a
                            >. <br />
                            Or, copy the following link into your browser:<br />
                            <strong>
                                http:\/\/$(req.headers.host)\/confirmation\/$(token.token)
                            </strong>
                            <br /><br />
                            Sincerely,
                            <br />
                            <strong>
                                The Scholarr Team
                            </strong>
                        </p>
                    </div>
                </div>
            </body>
        </html>
        `,
};

transporter.sendMail(message, function (err) {
  if (err) {
    return console.log({ msg: err.message });
  }
  console.log("An email has been sent");
});
