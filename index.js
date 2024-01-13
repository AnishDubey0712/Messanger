const express= require("express");
const app= express();
const mongoose=require("mongoose");
const Chat= require("./models/chat.js")
const path = require("path");
const methodOverride= require("method-override")
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));//basically to show thAT we are using static files from which folder
app.use(express.urlencoded({extended:true}));//for data parsing
app.use(methodOverride("_method"))
main().then(()=>{console.log("connection successfull")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');

 }

app.listen(8080,()=>{
    console.log("Server is listening");
});
app.get("/",(req,res)=>{
    res.send("Working")
});
///Index Route
app.get("/chats",async(req,res)=>{ 
let chats=await Chat.find();//Here chat.find() function is bringing data from DB so it is async function. so we have to write asnyc and await this function.

// By this code we've checked that all data is properly coming from our DB. Now we'll send it to our browser page.
console.log(chats); 
// to send all chats we've to use templates so we'll make ejs file for that in views
res.render("index.ejs",{chats})
});

//new chat route
app.get("/chats/new",(req,res)=>{
res.render("new.ejs")
})
//create route
app.post("/chats",(req,res)=>{
let {from,to,msg,created_at,updated_at}=req.body;//but we cannot take it from req.body directly.1st we've to parse data.
let newChat=new Chat({
from: from,
to: to,
msg: msg,
created_at: new Date(),

})
newChat.save().then(res=>{console.log("Chat Saved")}).catch(err=>{console.log(err)})
res.redirect("/chats")
});

//edit route
app.get("/chats/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let chat = await Chat.findById(id);
    
    res.render("edit.ejs",{chat});
});
app.put("/chats/:id",async (req,res)=>{
    let {id}= req.params;
    let {msg:newMsg}= req.body; // updated msg from req body
    let {created_at:updated_at} = new Date();

        console.log("Updating chat:", id, "with new message:", newMsg, "and updated_at:", updated_at);
    // Set the updated_at field to the current date and time
    updated_at = new Date();
    let updatedChat = await Chat.findByIdAndUpdate(id,
    {$set:{msg: newMsg,updated_at:updated_at}},{runValidators:true,new:true});// to update chat db will find chat by id and then update it.
console.log(updatedChat);
res.redirect("/chats")
});

//Delete route
app.delete("/chats/:id",async(req,res)=>{
    try {
        let { id } = req.params;
        let deletedChat = await Chat.findByIdAndDelete(id);
    
        // Check if the chat was deleted successfully
        if (!deletedChat) {
          throw new Error("Chat not found");
        }
    
        // Redirect to the chats page with a success notification
        res.redirect("/chats?notification=Chat deleted successfully");
      } catch (error) {
        // Redirect to the chats page with an error notification
        res.redirect("/chats?notification=Error deleting chat");
      }
})