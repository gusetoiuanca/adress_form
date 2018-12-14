const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const validator = require('validator');

// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const validLocales = ['AD', 'AT', 'AU', 'BE', 'BG', 'CA', 'CH', 'CZ', 'DE', 'DK', 'DZ', 'EE', 'ES', 'FI', 'FR', 'GB', 'GR', 'HR', 'HU', 'IL', 'IN', 'IS', 'IT', 'JP', 'KE', 'LI', 'LT', 'LU', 'LV', 'MX', 'NL', 'NO', 'PL', 'PT', 'RO', 'RU', 'SA', 'SE', 'SI', 'TN', 'TW', 'US', 'ZA', 'ZM'];

const errors = require('./errors.js');
let exp = {};
let prv = {};
let db = null;

prv.initializeDbConnection = (MongoClient, db) => {
    return (cb) => {
        if (db !== null) {
            return cb(null, db);
        }
        let mongoString = "mongodb://" + process.env.MONGO_HOST + ":" + process.env.MONGO_PORT + "/test";
        console.log('Connecting on ', mongoString);
        MongoClient.connect(mongoString,  (err, db) => {
            if (err) {
                console.log("Error received while connect to database ", err);
                return cb(err);
            }
            db = db;
            cb(null, db);
        });
    }
}

prv.closeDbConnection = (db) => {
    if (db !== null) {
        db.close();
    }
}

prv.queryDbForCountries = (results, cb) => {
    let query = {};
    let usedDatabase = results.db.db("test");
    usedDatabase.collection("countries").find(query).project({ _id: 0 }).toArray((err, result) => {
        if (err) {
            console.log("Error received while retrieving countries ", err);
            return cb(err);
        }
        cb(null, result)
    });
}

exp.getCountries = (cb) => {
    let tasks = {
        db: [prv.initializeDbConnection(MongoClient, db)],
        countries: ["db", prv.queryDbForCountries]
    };
    async.auto(tasks, (err, response) => {
        if (err) {
            return cb(err);
        }
        cb(null, response.countries);
    });
}

prv.queryDbForCities = (params) => {
    return (results, cb) => {
        let usedDatabase = results.db.db("test");
        let query = { country: params.country };
        usedDatabase.collection("cities").find(query).project({ lat: 0, lng: 0, _id: 0 }).toArray((err, result) => {
            if (err) {
                console.log("Error received while retrieving countries ", err);
                return cb(err);
            }
            let index = 0;
            let processedResult = result.map(element => {
                element.code = element.country + index;
                index++;
                return element;
            });

            cb(null, processedResult)
        });
    }
}

prv.insertEntry = (params) => {
    return (results, cb) => {
        let usedDatabase = results.db.db("test");
        usedDatabase.collection("users").insertOne(params, (err, result) => {
            if (err) {
                console.log("Error received while inserting user ", err);
                return cb(err);
            }
            cb({ status: 200 });
        });
    }
}

prv.validateEntry = (params) => {
    return (cb) => {
        /**
         * validate
         * params.email
         * params.postalCode
         * params.phone
         */

        if (!params.email ||
            !params.postalCode ||
            !params.country ||
            !params.phone ||
            !params.city ||
            !params.name ||
            !params.address
        ) {
            return cb(errors.invalid_form);
        }

        /**
         * Another noce to do is to check if the email is not only valid but not a disposable one
         */
        if (!validator.isEmail(params.email)) {
            return cb(errors.invalid_email);
        }
        let selectedCountry = params.country;

        if (validLocales.indexOf(selectedCountry) < 0) {
            selectedCountry = 'any';
        }

        if (!validator.isPostalCode(params.postalCode, params.country)) {
            return cb(errors.invalid_postal_code);
        }

        if (!phoneUtil.isValidNumberForRegion(phoneUtil.parse(params.phone, params.country), params.country)) {
            return cb(errors.invalid_phone_number);
        }

        cb();
    }
}

exp.getCities = (params, cb) => {
    let tasks = {
        db: [prv.initializeDbConnection(MongoClient, db)],
        cities: ["db", prv.queryDbForCities(params)]
    };
    async.auto(tasks, (err, response) => {
        if (err) {
            return cb(err);
        }
        cb(null, response.cities);
    });
}

/***
 * Params example
 {
	"email": "johndoe@mailinator.com",
	"postalCode": "99750-0077",
	"phone": "1-541-754-3010",
	"country": "US",
	"city": "New York",
	"name": "John Doe",
	"address": "New York address"
}
 */


exp.addUser = (params, cb) => {
    let tasks = {
        db: [prv.initializeDbConnection(MongoClient, db)],
        validateEntry: [prv.validateEntry(params)],
        insertEntry: ["db", "validateEntry", prv.insertEntry(params)]
    };
    async.auto(tasks, (err, response) => {
        if (err) {
            return cb(err);
        }
        cb();
    });
}


module.exports = Object.freeze(exp);
if (process.env.DEBUG) {
    module.exports = prv;
}