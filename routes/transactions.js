var express = require('express');
var router = express.Router();
var Paynl = require('paynl-sdk');

Paynl.Config.setApiToken('609f82277a2afab05e845011ebf57e05b1c11aca');
Paynl.Config.setServiceId('SL-9540-4851'); 

router.get('/startTransactionTest',function (req, res){
  var host = req.get('host')
  console.log("host: " + host)

  Paynl.Transaction.start({
    //the amount in euro
    amount: 48,

    testMode: true,
    
    //we redirect the user back to this url after the payment
    returnUrl: "https://brouwerijdelavkiaan.be/paymentSuccess.html",
    
    //the ip address of the user
    ipAddress: '81.164.178.176' 
  })
  .subscribe(
    function (result) {
      //redirect the user to this url to complete the payment
      console.log("paymentURL:" + result.paymentURL); 
      
      // the transactionId, use this to fetch the transaction later
      console.log("transactionID:" + result.transactionId);

      res.redirect(result.paymentURL)
    }, 
    function (error) {
      console.error(error); 
            
      res.status(500).send(error)
    }
  );
})

router.post('/startTransactionTest',function (req, res){
  Paynl.Transaction.start({
    //we redirect the user back to this url after the payment
    returnUrl: "https://brouwerijdelavkiaan.be/paymentSuccess.html",
    //the ip address of the user
    ipAddress: '81.164.178.176' ,
    //testmode
    testMode: true,

    //the amount in euro
    amount: req.body.amount,
    currency: "EUR",

    //end user
    enduser:{
      initials: req.body.fname,
      lastName: req.body.lname,
      emailAddress: req.body.email,
      phoneNumber: req.body.tel
    },

    //delivery address
    address:{
      streetName: req.body.street,
      houseNumber: req.body.number,
      houseNumberExtension: req.body.ponumber,
      zipCode: req.body.postal,
      city: req.body.city
    }
  })
  .subscribe(
    function (result) {
      console.log(result)
      //redirect the user to this url to complete the payment
      console.log(result.paymentURL); 
      
      // the transactionId, use this to fetch the transaction later
      console.log(result.transactionId);

      res.status(200).send(result.paymentURL)
    }, 
    function (error) {
      console.error(error);
      
      res.status(500).send(error)
    }
  );
})

router.post('/startTransaction',function (req, res){
  var host = req.get('host')

  Paynl.Transaction.start({
    //we redirect the user back to this url after the payment
    returnUrl: "https://brouwerijdelavkiaan.be/paymentSuccess.html",
    //the ip address of the user
    ipAddress: '81.164.178.176' ,
    //testmode
    testMode: false,

    //the amount in euro
    amount: req.data.amount,
    currency: "EUR",

    //end user
    enduser:{
      initials: req.data.fname,
      lastName: req.data.lname,
      emailAddress: req.data.email,
      phoneNumber: req.data.tel
    },

    //delivery address
    address:{
      streetName: req.data.street,
      houseNumber: req.data.number,
      houseNumberExtension: req.data.ponumber,
      zipCode: req.data.postal,
      city: req.data.city
    }
  })
  .subscribe(
    function (result) {
      console.log(result)
      //redirect the user to this url to complete the payment
      console.log(result.paymentURL); 
      
      // the transactionId, use this to fetch the transaction later
      console.log(result.transactionId);

      res.status(200).send(result.paymentURL)
    }, 
    function (error) {
      console.error(error); 
            
      res.status(500).send(error)
    }
  );
})

module.exports = router;
