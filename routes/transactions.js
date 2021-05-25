var express = require('express');
var mailSender = require("../sendMail.js");
var router = express.Router();
var Paynl = require('paynl-sdk');

Paynl.Config.setApiToken('609f82277a2afab05e845011ebf57e05b1c11aca');
Paynl.Config.setServiceId('SL-9540-4851'); 

router.post('/startTransactionTest',function (req, res){
  console.log(req.body)
  startTransaction(true, req, res)
})

router.post('/startTransaction',function (req, res){
  console.log(req.body)
  startTransaction(false, req, res)
})

function startTransaction(testMode, req, res){
  kost = (Number(req.body.amount) * 48).toFixed(2);

  Paynl.Transaction.start({
    //we redirect the user back to this url after the payment
    returnUrl: "https://brouwerijdelavkiaan.be/returnURL.html",
    //the ip address of the user
    ipAddress: req.connection.remoteAddress,
    //testmode
    testMode: testMode,

    //the amount in euro
    amount: kost,
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
      zipCode: req.body.zip,
      city: req.body.city
    }
  })
  .subscribe(
    function (result) {
      res.status(200).send(result.paymentURL)
    }, 
    function (error) {
      console.error(error);
      res.status(500).send(error)
    }
  );
}

router.get('/exchangeURL',function (req, res){
  Paynl.Transaction.get(req.params.order_id).subscribe(
    function(result){
      if (result.isPaid()) {
        console.log(`The transaction ${req.params.order_id} is completed`);
        mailSender.sendSuccessMail(result.enduser.initials, result.enduser.lastName, result.paymentDetails.amount, function (error, body){
          if (error) {
            console.error(error);
            res.status(200).send("TRUE")
          } else {
            console.log("Confirmation Mail Sent!");
            res.status(200).send("TRUE")
          }
        })

      }
      if (result.isCanceled()) {
        console.log(`Tranasaction ${req.params.order_id} is canceled, restock the items`);
        res.status(200).send("TRUE")
      }
      if (result.isBeingVerified()) {
        console.log(`Transaction ${req.params.order_id} needs to be verified first, possible fraud`);
        res.status(200).send("TRUE")
      }
    },
    function(error){
      console.error(error);
      res.status(500).send("FALSE")
    }
  );
})

module.exports = router;
