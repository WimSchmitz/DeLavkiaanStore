const mailgun = require("mailgun-js")({
  apiKey: '155d1170fcaa9c87a6e2585bc2ffeae7-fa6e84b7-17ebdc0a', 
  domain: 'mail.brouwerijdelavkiaan.be',
  host: "api.eu.mailgun.net"
});;
var mailcomposer = require('mailcomposer');
var handlebars = require("handlebars");
var fs = require("fs");

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

var sendSuccessMail = function (fname, email, amount, callback){
  readHTMLFile("./resources/successMail.html", function(err, html){
    var template = handlebars.compile(html);
    var replacements = {
      firstname: fname,
      amount: amount
    }
    var htmlToSend = template(replacements);
    
    var mail = mailcomposer({
      from: 'Brouwerij De Lavkiaan <info@brouwerijdelavkiaan.be>',
      to: email,
      subject: 'Bedankt voor je Bestelling!',
      html: htmlToSend
    });
    
    mail.build(function(mailBuildError, message) {
    
      var dataToSend = {
        to: email,
        message: message.toString('ascii')
      };
  
      mailgun.messages().sendMime(dataToSend, callback);
    });
  });
}

module.exports = {sendSuccessMail};