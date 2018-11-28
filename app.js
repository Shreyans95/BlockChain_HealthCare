const express = require('express');
const Web3 = require('web3');
const hbs = require('hbs');
const fs = require('fs');
const parser = require('body-parser');
const sha = require('sha256');

const pathToSolidity = __dirname +'/SolidityCode/';
var urlencodedParser = parser.urlencoded({ extended: true });
const app = express();
app.use(urlencodedParser);
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');


web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.defaultAccount = web3.eth.accounts[0];
web3.personal.unlockAccount(web3.eth.defaultAccount)

abiDefinition = JSON.parse(fs.readFileSync(pathToSolidity +'interface.json'));
RegistryContract = web3.eth.contract(abiDefinition);

string  = fs.readFileSync(pathToSolidity +'contractAddress').toString();
if(string[string.length - 1] == '\n')
string  = string.slice(0,-1);
contractInstance = RegistryContract.at(string);




app.get('/', (req, res) => {
	res.render('index', {
					name: "Monish",
					age: 21
	});
});

app.post('/registerMedicine', (req, res) => {
	var medicineName = req.body.medicineName;
	var manufacturerName = req.body.manufacturerName;
	var department = req.body.department;
	var referenceNumber = req.body.referenceNumber;
	var date = req.body.date;
	var quantity = req.body.quantity;
	var city = req.body.city;
	var genere = req.body.genere;

	var transactionId = contractInstance.newRegistry(parseInt(sha(manufacturerName +medicineName +referenceNumber)), referenceNumber, medicineName, date, city, quantity, {from: web3.eth.coinbase,gas:3000000});
	console.log(transactionId);
	res.render('index');
});



app.post('/addMedicine', (req, res) => {
	var medicineName = req.body.medicineName;
	var manufacturerName = req.body.manufacturerName;
	var referenceNumber = req.body.referenceNumber;
	var date = req.body.date;
	var city = req.body.city;
	var quantity = req.body.quantity;
	var transactionId = contractInstance.updateRegistry(parseInt(sha(manufacturerName +medicineName +referenceNumber)), referenceNumber, medicineName, date,  city, quantity,{from: web3.eth.coinbase,gas:3000000});
	console.log(transactionId);
	res.render('index');
});


app.post('/getMedicine', (req, res) => {
	var manufacturerName = req.body.manufacturerName;
	var medicineName = req.body.medicineName;
	var referenceNumber = req.body.referenceNumber;
	var result = contractInstance.getRegistry.call(parseInt(sha(manufacturerName +medicineName +referenceNumber)));
	// res.send(result);
	// console.log("result is here " + result);
	date = result[0].split("$");
	referenceNumber = result[1];
	city = result[2].split("$");
	quantity = result[3];
	console.log(date+ "\n" + referenceNumber +"\n" + city + "\n" + quantity);
	data = [];
	for(var i = 0; i < date.length -1; i++) {
		data.push({
			date: date[i],
			referenceNumber: parseInt(referenceNumber[i], 10),
			city: city[i],
			quantity: parseInt(quantity[i], 10)
		});
	}
	console.log(data);
	res.render('show1', {
		data
	});
	 // res.render("getMedicine",{'title':result});
	
});


app.listen(3000, () => {
	console.log("Listening on port 3000");
});
