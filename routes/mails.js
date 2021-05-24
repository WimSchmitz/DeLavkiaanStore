const mailgun = require("mailgun-js")({
  apiKey: '155d1170fcaa9c87a6e2585bc2ffeae7-fa6e84b7-17ebdc0a', 
  domain: 'sandbox5240d86042294664b8532ef5c7891fe7.mailgun.org'
});;
var express = require('express');
var mailcomposer = require('mailcomposer');
var fs = require("fs");
var handlebars = require("handlebars");

var router = express.Router();

var readHTMLFile = function(path, callback){
  fs.readFile(path, {encoding: 'utf-8'}, function(err, html){
    if (err) {
      console.error(err);
      callback(err);
    } else {
      callback (null, html);
    }
  })
}

router.get('/testMail',function (req, res){
  readHTMLFile("./resources/successMail.html", function(err, html){
    var template = handlebars.compile(html);
    var replacements = {
      firstname: "Wim",
      amount: "0,00"
    }
    var htmlToSend = template(replacements);
    
    var mail = mailcomposer({
      from: 'Brouwerij De Lavkiaan <brouwerijdelavkiaan@gmail.com>',
      to: "Wim Schmitz <wim@schmitz.cc>",
      subject: 'Bedankt voor je Bestelling!',
      html: htmlToSend
    });
    
    mail.build(function(mailBuildError, message) {
    
      var dataToSend = {
        to: "Wim Schmitz <wim@schmitz.cc>",
        message: message.toString('ascii')
      };
  
      mailgun.messages().sendMime(dataToSend, function (error, body) {
        if (error) {
          console.log(error);
          res.status(500).send("Bad Mail Request.")
        } else {
          console.log(body);
          res.status(200).send("Mail Sent!");
        }
      });
    });
  })
})

router.post('/sendSuccessMail',function (req, res){
  readHTMLFile("./resources/successMail.html", function(err, html){
    var template = handlebars.compile(html);
    var replacements = {
      firstname: req.body.fname,
      amount: req.body.amount
    }
    var htmlToSend = template(replacements);
    
    var mail = mailcomposer({
      from: 'Brouwerij De Lavkiaan <brouwerijdelavkiaan@gmail.com>',
      to: req.body.email,
      subject: 'Bedankt voor je Bestelling!',
      html: htmlToSend
    });
    
    mail.build(function(mailBuildError, message) {
    
      var dataToSend = {
        to: req.body.email,
        message: message.toString('ascii')
      };
  
      mailgun.messages().sendMime(dataToSend, function (error, body) {
        if (error) {
          console.log(error);
          res.status(500).send("Bad Mail Request.")
        } else {
          console.log(body);
          res.status(200).send("Mail Sent!");
        }
      });
    });
  })
})

router.post('/subscribe', function(req, res){
  var subscribeData = {
    from: 'Brouwerij De Lavkiaan <brouwerijdelavkiaan@gmail.com>',
    to: req.body.email,
    subject: 'Bedankt voor jouw interesse!',
    text: "Hallo! \n \nWe hebben de inschrijving voor de nieuwsbrief goed ontvangen. \nWe houden je verder op de hoogte van al onze ontwikkelingen! \n\n\nEen stevige linker,\n\nBrouwerij De Lavkiaan"
  };

  var subscribeConfirmData = {
    from: req.body.email,
    to: "Brouwerij De Lavkiaan <brouwerijdelavkiaan@gmail.com>",
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
    to: "brouwerijdelavkiaan@gmail.com",
    subject: 'Vraag van ' + req.body.name ,
    text: req.body.question
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


