const express = require("express");
const cors = require("cors");
require("dotenv").config();
const logger = require("./config/logger");
const requestLogger = require("./middleware/logger");

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const app = express();
const PORT = process.env.PORT || 5000;

const otpRoutes = require("./routes/otpRoutes");
const loginroutes = require("./routes/loginroutes");
const loanroutes = require("./routes/loanroutes");
const companyroutes = require("./routes/companyroutes");
const businessroutes = require("./routes/businessroutes");
const businesslenderroutes = require("./routes/businesslenderroutes");
const contactroutes = require("./routes/contactroute");
const connectDB = require("./config/db");
app.use(requestLogger);
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

connectDB();
app.use("/api",contactroutes);
app.use("/api", loginroutes);
app.use("/api", otpRoutes);
app.use("/api/loan", loanroutes);
app.use("/api/company", companyroutes);
app.use("/api/business", businessroutes);
app.use("/api/business-lender", businesslenderroutes);


app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>My Server</title>
            <style>
                body{
                    background:#111;
                    color:white;
                    text-align:center;
                    padding-top:100px;
                    font-family:Arial;
                }
                h1{
                    color:lime;
                }
                button{
                    padding:10px 20px;
                    border:none;
                    background:orange;
                    color:black;
                    font-size:18px;
                    border-radius:10px;
                    cursor:pointer;
                }
            </style>
        </head>
        <body>
            <h1>Node Server Running</h1>
            <p>Welcome to my backend server</p>
            <button onclick="alert('Server Live')">Click</button>
        </body>
        </html>
    `);
});

app.get("/read", (req, res) => {
    res.send(`
        <h1>Welcome</h1>
        <img src="/server.jpg" width="300">
    `);
});


app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
