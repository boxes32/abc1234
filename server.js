const express = require("express");
const mongoose = require("mongoose");
const ShortURLs = require("./models/shortURLs");
const methodOverride=require('method-override');
const app = express();
var bodyParser=require("body-parser");
var db=mongoose.connection;
mongoose.connect(
	"mongodb+srv://user123:Blueberrypie1@cluster0.ryswo.mongodb.net/Data?authSource=admin&replicaSet=atlas-9ibfbx-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("CONNECTION ESTABLISHED!");
		}
	}
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
	const shortURLs = await ShortURLs.find();
	res.render("index", { shortURLs: shortURLs });
});

app.post("/shortURLs", async function(req, res) {
	await ShortURLs.create({ full: req.body.fullURL });
	res.redirect("/");
});

app.delete("/:id", async (req, res) => {
	await ShortURLs.findByIdAndDelete(req.params.id,function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("DELETED!");
            res.redirect('/');
        }
    });
});
app.get("/:shortUrl", async (req, res) => {
	const shortUrl = await ShortURLs.findOne({ short: req.params.shortUrl });
	if (shortUrl == null) return res.sendStatus(404);
	shortUrl.clicks++;
	shortUrl.save();
	res.redirect(shortUrl.full);
});
app.listen(process.env.PORT || 5000);

app.use(express.static(__dirname));  
  
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
  
app.post('/sign_up', function(req,res){
    var name = req.body.name;
    var email =req.body.email;
    var pass = req.body.password;
    var phone =req.body.phone;
  
    var data = {
        "name": name,
        "email":email,
        "password":pass,
        "phone":phone
    }
db.collection('details').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
              
    });
          
    return res.redirect('http://localhost:5000/');
})