


function parseEnDate(dateStr) 
{
	var enMons = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
	var enMonths = ["January", "February", "March", "April", "May", "June", "July", "Aguest", "September", "October", "November", "December"];
	
	var dateArr = dateStr.split(/\s+|\s*,\s*/);
	var month = enMons.indexOf(dateArr[0]);
	if (month < 0) {
		month = enMonths.indexOf(dateArr[0])
		if (month < 0) {
			return;
		}
	}
	
	var date = parseInt(dateArr[1], 10);
	if (date <= 0) {
		return
	} else if (month==1 && date>29) {
		return;
	} else if ([1,3,5,7,8,9,10,12].indexOf(date)!=-1 && date>31) {
		return
	} else if (date > 30) {
		return;
	}
	
	var year = parseInt(dateArr[2]);
	if (dateArr[2] != year) {
		return
	}
	return new Date(year, month, date)
}

function convertEnDate(date) 
{
	var enMonths = ["January", "February", "March", "April", "May", "June", "July", "Aguest", "September", "October", "November", "December"];
	
	var year = date.getFullYear();
	var month = date.getMonth();
	var d = date.getDate();
	
	month = enMonths[month];
	return month + ' ' + d + ', ' + year;
}

var dateParam = "December 15, 2015" + " 08:00:00";
dateParam = "1450137600";

function output(dateParam) {
	var date = parseEnDate(dateParam);
	if (!date) {
		var dateNum = parseInt(dateParam, 10);
		if (dateNum != dateParam) {
			return "null";
		}
		
		dateNum *= 1000;
		date = new Date(dateNum)
		if (!date) {
			return "null";
		}
	}
	return JSON.stringify({ "unix": date.getTime()/1000, "natural": convertEnDate(date)});
}

function heredoc(fn) {return fn.toString().split('\n').slice(1,-1).join('\n') + '\n';}

require("http").createServer(function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	var path = require('url').parse(request.url).pathname;
	var out = '';
	if (path === '/') {
		var out = heredoc(function(){/*
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="UTF-8">
				<title>Timestamp microservice</title>
				<link rel="stylesheet" href="http://apps.bdimg.com/libs/bootstrap/3.3.4/css/bootstrap.min.css">
			</head>
			<body>
				<div class="container">
					<h3>Example usage:</h3>
						<code>https://timestamp123.herokuapp.com/December%2015,%202015</code><br>
						<code>https://timestamp123.herokuapp.com/1450137600</code>
						<h3>Example output:</h3>
						<code>
								{
									"unix": 1450137600,
									"natural": "December 15, 2015"
								}
						</code>
				</div>
			</body>
		</html>
		*/});
	} else if (path !== '/favicon.ico') {
		var param = decodeURI(path.substr(1));
		out = output(param);
	}
	response.end('OK');
}).listen(process.env.PORT || 5000);

