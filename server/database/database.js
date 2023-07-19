const mongoose = require("mongoose");
let database = {};

database.init = async (app, config) => {
    console.log("database.js: init() called.");
    await connect(app, config, true);
};

async function connect(app, config, first) {
    try {
        console.log("databse.js: connect() called");

        let databaseUrl = process.env.DATABASE_URL || config.db_url;

        mongoose.set('strictQuery', false);

        console.log("connecting to database .........");
        console.log(`databas url ${process.env.MONGO_URI}`);

        mongoose.Promise = global.Promise;
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            dbName: process.env.DB_NAME,
        });
        database = connect.connection;
        await createSchema(app, config);

        database.on(
            "error",
            console.error.bind(console, "mongoose connection error.")
        );
        database.on("open", function () {
            console.log("successfully connected to database. : " + databaseUrl);

            database.on("disconnected", () => {
                console.log("database disconnected. Reconnect in 5 seconds");
                setInterval(()=>{
                    reconnect(app,config);
                }, 5000);
            });
        });
    } catch (error) {
        console.log(error);
        setInterval(()=>{
            reconnect(app,config);
        }, 5000);
    }
    
}

function reconnect(app, config){
    console.log("databse.js: reconnect() called");

    let databaseUrl = process.env.DATABASE_URL || config.db_url;

    console.log("connecting to database .........");
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    database = mongoose.connection;

    database.on(
        "error",
        console.error.bind(console, "mongoose connection error.")
    );
    database.on("open", function () {
        console.log("successfully connected to database. : " + databaseUrl);

        database.on("disconnected", () => {
            console.log("database disconnected. Reconnect in 5 seconds");
            setInterval(()=>{
                reconnect(app,config);
            }, 5000);
        });
    });
}

function createSchema(app, config) {
    let schemaLen = config.db_schemas.length;
    console.log("number of schemas defined on config.js : %d\n\n", schemaLen);

    for (let i = 0; i < schemaLen; i++) {
        let curItem = config.db_schemas[i];
        
        console.log(curItem.schemaName);
        

        let curSchema = require("./schema/"+curItem.schemaName).createSchema(mongoose);
        console.log("%s schema created", curItem.schemaName);

        let curModel = mongoose.model(curItem.modelName, curSchema);
        console.log("%s model created.\n", curItem.modelName);

        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
    }

    app.set("database", database);
}

module.exports = database;
