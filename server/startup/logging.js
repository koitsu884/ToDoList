//TODO: Should use logging liblary

module.exports = function() {
    process.on('uncaughtException', (ex) => {
        console.log("UNCAUGHT EXCEPTION!!");
        console.log(ex);
        console.log("Closing process..");
        process.exit(1);
    });

    process.on('unhandledRejection', (ex) => {
        console.log("UNHANDLED REJECTION!!");
        console.log(ex);
        console.log("Closing process..");
        process.exit(1);
    })
  }