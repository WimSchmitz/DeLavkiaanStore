const mailgun = require("mailgun-js")({
  apiKey: '155d1170fcaa9c87a6e2585bc2ffeae7-fa6e84b7-17ebdc0a', 
  domain: 'mail.brouwerijdelavkiaan.be',
  host: "api.eu.mailgun.net"
});;
var express = require('express');
var mailSender = require('../sendMail.js')
var router = express.Router();

router.get('/testMail',function (req, res){
  mailSender.sendSuccessMail("Wim", "wim@schmitz.cc", "10,00", function (error, body){
    if (error) {
      console.log(error);
      res.status(500).send("Bad Mail Request.")
    } else {
      console.log(body);
      res.status(200).send("Mail Sent!");
    }
  })
})

router.post('/sendSuccessMail',function (req, res){
  mailSender.sendSuccessMail(req.body.fname, req.body.email, req.body.amount, function (error, body){
    if (error) {
      console.log(error);
      res.status(500).send("Bad Mail Request.")
    } else {
      console.log(body);
      res.status(200).send("Mail Sent!");
    }
  })
})

router.post('/subscribe', function(req, res){
  var subscribeData = {
    from: 'Brouwerij De Lavkiaan <info@brouwerijdelavkiaan.be>',
    to: req.body.email,
    subject: 'Bedankt voor jouw interesse!',
    text: "Hallo! \n \nWe hebben de inschrijving voor de nieuwsbrief goed ontvangen. \nWe houden je verder op de hoogte van al onze ontwikkelingen! \n\n\nEen stevige linker,\n\nBrouwerij De Lavkiaan"
  };

  var subscribeConfirmData = {
    from: req.body.email,
    to: "Brouwerij De Lavkiaan <info@brouwerijdelavkiaan.be>",
    subject: 'SUBSCRIBE',
    text: req.body.email
  };
  
  mailgun.messages().send(subscribeData, function (mailerr, mailresp) {
    if (mailresp){
      mailgun.messages().send(subscribeConfirmData, function (mailerr, mailresp) {
        if (mailresp){
          res.status(200).send("Mail Sent!");
        } else {
          res.status(500).send("Confirmation mail failed " + mailerr);
        }
      });
    } else {
      res.status(500).send("Bad Mail Request. " + mailerr);
    }
  });
})

router.post('/question', function(req,res){
  var questionData = {
    from: `${req.body.name} <${req.body.email}>`,
    to: "info@brouwerijdelavkiaan.be",
    subject: 'Vraag van ' + req.body.name ,
    text: req.body.body
  };
  
  mailgun.messages().send(questionData, function (mailerr, mailresp) {
    if (mailresp){
      res.status(200).send("Mail Sent!");
    } else {
      res.status(500).send("Bad Mail Request. " + mailerr);
    }
  });
})

module.exports = router;


