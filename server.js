const app = require('./app');
const dotenv = require('dotenv');
const connectToDataBase = require('./config/database');

// uncaught exception
process.on("uncaughtException", err => {

    console.error(`Uncaught exception : ${err.message}`);
    console.error("Shutting down server due to uncaught exception");
    process.exit(1);

})

// setting up env file
dotenv.config({ path: './config/info.env' });

const port = process.env.PORT || 5000;

const igniteTheServer = () => {

    try {

        connectToDataBase();
        const server = app.listen(port, () => {
            console.log(`Application is live on server : http://localhost/${port}`);
        })

        // unhandled promise rejection
        process.on("unhandledRejection", err => {
            console.error(`Unhanled promise rejection : ${err.message}`);
            console.error(`Shutting down server due to unhandled promise rejection`);
            server.close(() => process.exit(1));
        })

        // graceful shutdown
        process.on("SIGINT", () => {
            console.log("Recieved SIGINT , closing server gracefully");
            server.close(() => {
                console.log("Server closed! -- Exiting process");
                process.exit(0);
            })
        })

    } catch (error) {
        console.log("Error conencting to database");
        console.log(`-------------ERROR----------- : ${error.message}`);
    }

}

igniteTheServer();
