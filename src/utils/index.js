//Mongo DB CRUD service.

require("dotenv").config();
const { MongoClient, ObjectId }  = require("mongodb");

class Movie{
    constructor(title, actor="", director=""){
        this.title = title;
        this.actor = actor;
        this.direct = director;
    }
}

class Movies{
    constructor(dbName, collection)
    {
        this.dbName = dbName;
        this.collection = collection;
    }

    static client;
    static db;
    static collection;

    async connect(){
        //connect to the database

        try {
            this.client = new MongoClient(process.env.MONGO_URI);
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            this.collection = this.db.collection(this.collection);

        } catch (error) {
            console.log(error);
        }
    }

    async close(){
        //close connection

        try {
            await this.client.close();

        } catch (error) {
            console.log(error);
        }
    }

    async add(newMovie){
        //movie is a complete object
        
        try {
            await this.connect();
            const result =  await this.collection.insertOne(newMovie);
            console.log(result);
            await this.close();
            return (result.acknowledged) ? true : false;

        } catch (error) {
            console.log(error);
        }

    }

    async delete(id){
        //can pass either a complete movie of just the id
        try {
            await this.connect();
            const result  = await this.collection.deleteOne({_id: ObjectId(id)});
            console.log(result)
            await this.close();
            return (result.acknowledged) ? true : false;

        } catch (error) {
            console.log(error);
        }

    }

    async modify(id, movie){
        //pass the complete movie object
        try {
            await this.connect();
            
            // remove any null or empty string keys from the object
            // only key value pairs passed are updated, the rest
            // remain unchanged
            const keys = Object.keys(movie)
            const values = Object.values(movie)
            let modifiedMovie = movie;

            // loop through the values and remove the key from modifiedMovie
            // if the value is falsy.
            for(let i=keys.length; i>=0; i--){
                if (!values[i]){
                    let {[keys[i]]: unused, ...tempMovie} = modifiedMovie;
                    modifiedMovie = tempMovie;
                }
            }
            // remove the _id from the movie object if it exists
            // as this should be immutable only and should not be updated
            delete modifiedMovie._id

            // filtering on an auto Id requires the id string to be wrapped
            // in a mongoDb ObjectId
            const filter = {_id: ObjectId(id)};
            
            const updateDoc = {
                $set: modifiedMovie
            }

            const result = await this.collection.updateOne(filter, updateDoc);
            console.log(result)

            await this.close();

            return (result.acknowledged) ? true : false;

        } catch (error) {
            console.log(error);
        }
    }

    async read(){
        //get all results

        try {
            await this.connect();
            const data = await this.collection.find({}).toArray();
            await this.close();
            return(data);
        } catch (error) {
            console.log(error);
        }
    }

    async readOne(id){
         //get a single record using id

         try {
            await this.connect();
            const data = await this.collection.find({_id: ObjectId(id)}).toArray();
            await this.close();
            return(data);
        } catch (error) {
            console.log(error);
        }
    }

    async search(movie){
         //pass a query in the form of a movie object to get results

         try {
            await this.connect();

            // remove any null or empty string keys from the object
            // only key value pairs passed are updated, the rest
            // remain unchanged
            const keys = Object.keys(movie)
            const values = Object.values(movie)
            let modifiedMovie = movie;

            // loop through the values and remove the key from modifiedMovie
            // if the value is falsy.
            for(let i=keys.length; i>=0; i--){
                if (!values[i]){
                    let {[keys[i]]: unused, ...tempMovie} = modifiedMovie;
                    modifiedMovie = tempMovie;
                }
            }

            const data = await this.collection.find(modifiedMovie).toArray();
            await this.close();
            return(data);
        } catch (error) {
            console.log(error);
        }

    }

}

module.exports = {Movie, Movies};