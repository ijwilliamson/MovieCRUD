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
        let newMoview = movie;
        try {
            await this.connect();
            let keys = Object.keys(movie)
            let values = Object.values(movie)
            let modifiedMovie = movie;
            for(let i=keys.length; i>=0; i--){
                if (!values[i]){
                    let {[keys[i]]: unused, ...tempMovie} = modifiedMovie;
                    modifiedMovie = tempMovie;
                }
            }
            delete modifiedMovie._id

            const filter = {_id: ObjectId(id)};
            // const updateDoc = {
            //     $set: {
            //         title: (movie.title) ? movie.title : null,
            //         actor: (movie.actor) ? movie.actor : null,
            //         director: (movie.director) ? movie.director : null
            //     }
            // };
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
        //pass a query to get results

        try {
            await this.connect();
            const data = await this.collection.find({}).toArray();
            await this.close();
            return(data);
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = {Movie, Movies};