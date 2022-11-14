//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoListDB",{useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to todo list"
});
const item2 = new Item({
  name: "Hit the + button add a new item"
});
const item3 = new Item({
  name: "<--Hit this to delete an item.>"
});

const defaultItems = [item1, item2, item3];


// Item.insertMany(defaultItems, function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("All items added successfully");
//   }
// });


app.get("/", function(req, res) {

  Item.find({},function(err, foundItems){

      if(foundItems.length ===0){
          Item.insertMany(defaultItems, function(err){
          if(err){
            console.log(err);
          }else{
            console.log("All items added successfully");
          }
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
    
  });


});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkItemId, function(err){
    if(!err){
      console.log("Deleted Suceesfully");
    }
    res.redirect("/");
  })
});
//Custom List Item
app.get("/:customListName", function(req,res){
  const customListName = req.params.customListName;
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
