const mongoose=require("mongoose");
const Chat= require("./models/chat.js")

main().then(()=>{console.log("connection successfull")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');

}

let allChats=[{
    from: "Sam",
    to: "David",
    msg: "Hi, David",
    created_at: new Date(),
},
{
    from: "Brazilia",
    to: "Jennifer",
    msg: "How to make maggie??",
    created_at: new Date(),

},
{
    from: "Brock",
    to: "Jack",
    msg: "Hi, Jack Whats up!",
    created_at: new Date(),

},
{
    from: "Ronnie",
    to: "Robert",
    msg: "Yeah Buddy!!",
    created_at: new Date(),

},
{
    from: "Mr.Fox",
    to: "Kia",
    msg: "Hi, How are you?",
    created_at: new Date(),

},

];

Chat.insertMany(allChats);
// chat1.save().then((res)=>{
//     console.log(res)
// })