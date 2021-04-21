function StartTransaction() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  // myHeaders.append("Authorization", "Basic QVQtMDA2NS05NjMwOjYwOWY4MjI3N2EyYWZhYjA1ZTg0NTAxMWViZjU3ZTA1YjFjMTFhY2E=");
  // myHeaders.append("Access-Control-Allow-Origin","*")
  
  var urlencoded = new URLSearchParams();
  urlencoded.append("serviceId", "SL-9540-4851");
  urlencoded.append("amount", "4200");
  urlencoded.append("ipAddress", "81.164.178.176");
  urlencoded.append("finishUrl", "./return.html");
  urlencoded.append("paymentOptionId", "436");
  urlencoded.append("testMode", "0");
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  
  fetch("https://rest-api.pay.nl/v16/Transaction/start/json", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .then(response => window.open(response.transaction.paymentURL) )
    .catch(error => console.log('error', error));
}

setTimeout(StartTransaction(), 3000);