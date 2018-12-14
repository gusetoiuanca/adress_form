const app = require('../libs/db.js');
let results = {};
let mongoConnectionString = "mongodb://"+process.env.MONGO_HOST+":"+process.env.MONGO_PORT+"/test";
let MongoClient = {
    connect: jest.fn()
}

it('Check Mongo connection link', (done) => {
    let spy = jest.fn();
    app.initializeDbConnection(MongoClient, null)(null);
    expect(MongoClient.connect.mock.calls[0][0]).toBe(mongoConnectionString);
    expect(MongoClient.connect.mock.calls.length).toBe(1);
    done();
});


it('Check response when Mongo is already initialised', (done) => {
    let spy = jest.fn();
    let db = {database:'object'};
    app.initializeDbConnection(null, db)(spy);
    expect(spy.mock.calls.length).toBe(1);
    expect(spy.mock.calls[0][0]).toBe(null);
    expect(spy.mock.calls[0][1]).toBe(db);
    done();
});

it('Check response when connecting to Mongo errors', (done) => {
    MongoClient.connect = jest.fn().mockImplementationOnce((connectionString, cb) => cb("error"));
    let spy = jest.fn();
    app.initializeDbConnection(MongoClient, null)(spy);
    expect(MongoClient.connect.mock.calls[0][0]).toBe(mongoConnectionString);
    expect(MongoClient.connect.mock.calls.length).toBe(1);
    expect(spy.mock.calls.length).toBe(1);
    expect(spy.mock.calls[0][0]).toBe("error");
    done();
});

it('Check response when connecting to Mongo works fine', (done) => {
    let db = {database:'object'};
    MongoClient.connect = jest.fn().mockImplementationOnce((connectionString, cb) => cb(null, db));
    let spy = jest.fn();
    app.initializeDbConnection(MongoClient, null)(spy);
    expect(MongoClient.connect.mock.calls[0][0]).toBe(mongoConnectionString);
    expect(MongoClient.connect.mock.calls.length).toBe(1);
    expect(spy.mock.calls.length).toBe(1);
    expect(spy.mock.calls[0][0]).toBe(null);
    expect(spy.mock.calls[0][1]).toBe(db);
    done();
});

