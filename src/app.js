//Mongo DB CLI

const {Movie, Movies} = require('./utils/index');
const yargs = require("yargs");


const app = async (ui) =>{
   
    const movies = new Movies("M42MongoCLI", "Movie");
    
    if (ui.create){
        //Add a moview
        await movies.add(
            new Movie(ui.title, ui.actor, ui.director));
        
    } else if (ui.read) {
        //read data
        const data = await movies.read();
        console.table(data);

    } else if (ui.readOne){
        //read a single record based on id
        const data = await movies.readOne(ui.id)
        console.table(data)
    
    } else if (ui.search) {
        //search data
        const data = await movies.search(
            new Movie(ui.title, ui.actor, ui.director));
            console.table(data);

    } else if (ui.update) {
        //update data
        await movies.modify(ui.id,
            new Movie(ui.title, ui.actor, ui.director));
        
    } else if (ui.delete) {
        //delete a record.  Pass the id.
        await movies.delete(ui.id);

    } else {
        //no valid command passed
        console.log("command not recognised")
    }
}   

app(yargs.argv);