var Paynl = require('paynl-sdk');
var express = require('express');

Paynl.Config.setApiToken('609f82277a2afab05e845011ebf57e05b1c11aca');
Paynl.Config.setServiceId('SL-9540-4851'); 

const hostname = '127.0.0.1';
var port = process.env.PORT||3000;


const app = express();

app.get('/',function (req, res){
  res.send("The API works!")
});

app.get('/startTransactionTest',function (req, res){

  Paynl.Transaction.start({
    //the amount in euro
    amount: 48,

    testMode: true,
    
    //we redirect the user back to this url after the payment
    returnUrl: "http://www.google.be",
    
    //the ip address of the user
    ipAddress: '81.164.178.176' 
  })
  .subscribe(
    function (result) {
      console.log(result)
      //redirect the user to this url to complete the payment
      console.log(result.paymentURL); 
      
      // the transactionId, use this to fetch the transaction later
      console.log(result.transactionId);

      res.redirect(result.paymentURL)
    }, 
    function (error) {
      console.error(error); 
    }
  );
})

app.get('/startTransaction',function (req, res){

  Paynl.Transaction.start({
    //the amount in euro
    amount: 48,
    
    //we redirect the user back to this url after the payment
    returnUrl: "http://www.google.be",
    
    //the ip address of the user
    ipAddress: '81.164.178.176' 
  })
  .subscribe(
    function (result) {
      console.log(result)
      //redirect the user to this url to complete the payment
      console.log(result.paymentURL); 
      
      // the transactionId, use this to fetch the transaction later
      console.log(result.transactionId);

      res.redirect(result.paymentURL)
    }, 
    function (error) {
      console.error(error); 
    }
  );
})


app.post('/startTransaction',function (req, res){
  res.send("We will redirect you to the payment resolver soon, please stand by!")
  Paynl.Transaction.start({
    //the amount in euro
    amount: req.data,

    testMode: true,
    
    //we redirect the user back to this url after the payment
    returnUrl: "http://www.google.be",
    
    //the ip address of the user
    ipAddress: '81.164.178.176' 
  })
  .subscribe(
    function (result) {
      console.log(result)
      //redirect the user to this url to complete the payment
      console.log(result.paymentURL); 
      
      // the transactionId, use this to fetch the transaction later
      console.log(result.transactionId);

      res.redirect(result.paymentURL)
    }, 
    function (error) {
      console.error(error); 
    }
  );
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});