const router = require('express').Router();
const convert = require('xml-js');
const axios = require('axios');

router.get('/', function(req, res, next) {
	soapRequest()
	.then(response => {
		var responseObject = convert.xml2js(response.data, {spaces: 4});
		// console.log(response.data);
		var text = responseObject.elements[0].elements[0].elements[0].elements[0].elements[0].text;
		var arr = text.split(";");
		res.send( JSON.stringify(arr) );
	})
	.catch(err => {
		res.send( err.message );
	});
});



function soapRequest(res) {
var xmlBody = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<InstrumentAndShare xmlns="http://tsetmc.com/">
			<DEven>20190803</DEven>
			<LastID>0</LastID>
		</InstrumentAndShare>
	</soap:Body>
</soap:Envelope>
`;

	return axios({
		url: 'http://service.tsetmc.com/WebService/TseClient.asmx',
		method: 'POST',
		headers: {
			"Content-Type": "text/xml;charset=UTF-8",
			"Accept-Encoding": "gzip,deflate",
			"SOAPAction": "http://tsetmc.com/InstrumentAndShare",
			"Cache-Control": "no-cache"
		},
		data: xmlBody
	});
}








module.exports = router;