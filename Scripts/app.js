function generateFlightLink(departureAirport, destinationAirport, destination, date, convertedDate) {
    return `${date}: <strong><a href="https://www.momondo.ro/in?a=travelator&url=/flight-search/${departureAirport}-${destinationAirport}/${convertedDate}?sort=price_a&encoder=27_1&enc_pid=deeplinks&enc_eid=0&enc_lid=${destination}&enc_cid=article&utm_source=travelator&utm_medium=affiliate&utm_term=rev&utm_campaign=deeplinks&utm_content=${destination}">ZBOR</a></strong>`;
}

function generateLodgingsLink(hotel, destination, convertedDate) {
    return `<strong><a href="https://www.momondo.ro/in?a=travelator&url=/hotel-search/${hotel}/${convertedDate}/2adults?sort=price_a&encoder=27_1&enc_pid=deeplinks&enc_eid=0&enc_lid=${destination}&enc_cid=article&utm_source=travelator&utm_medium=affiliate&utm_term=rev&utm_campaign=deeplinks&utm_content=${destination}">CAZARE</a></strong>`;
}

function generateLink(hotel, departureAirport, destinationAirport, destination, date, convertedDate) {
    return generateFlightLink(departureAirport, destinationAirport, destination, date, convertedDate) + ' | ' + generateLodgingsLink(hotel, destination, convertedDate);
}

function convertMonth(month) {
    switch (month.toLowerCase()) {
        case 'ian':
            return '01';
        case 'feb':
            return '02';
        case 'mar':
            return '03';
        case 'apr':
            return '04';
        case 'mai':
            return '05';
        case 'iun':
            return '06';
        case 'iul':
            return '07';
        case 'aug':
            return '08';
        case 'sep':
            return '09';
        case 'oct':
            return '10';
        case 'nov':
            return '11';
        case 'dec':
            return '12';
    }
}

var supportedDateFormatsRegex = {
    format1: new RegExp('^[0-3]?\\d{1}[\\s](ian|feb|mar|apr|mai|iun|iul|aug|sep|nov|dec)[\\s]\\d{4}$'), //DD MMM YYYY
    format2: new RegExp('^[0-3]?\\d{1}[-][0-3]?\\d{1}[\\s](ian|feb|mar|apr|mai|iun|iul|aug|sep|nov|dec)[\\s]\\d{4}$'), //DD-DD MMM YYYY
    format3: new RegExp('^[0-3]?\\d{1}[\\s](ian|feb|mar|apr|mai|iun|iul|aug|sep|nov|dec)[\\s][-][\\s][0-3]?\\d{1}[\\s](ian|feb|mar|apr|mai|iun|iul|aug|sep|nov|dec)[\\s]\\d{4}$'), //DD MM - DD MM YYYY
    format4: new RegExp('^[0-3]?\\d{1}[\\s](ian|feb|mar|apr|mai|iun|iul|aug|sep|nov|dec)[\\s]\\d{4}[\\s][-][\\s][0-3]?\\d{1}[\\s](ian|feb|mar|apr|mai|iun|iul|aug|sep|nov|dec)[\\s]\\d{4}$') //DD MM YYYY - DD MM YYYY
}

var convertedDateIntervalRegex = new RegExp('^\\d{4}[-][0-1][0-3][-][0-3]\\d{1}[/]\\d{4}[-][0-1][0-3][-][0-3]\\d{1}$');
var convertedDateRegex = new RegExp('^\\d{4}[-][0-1][0-3][-][0-3]\\d{1}$');

function convertFromRegex1(date) {
    var days = date.split(' ')[0];
    var month = convertMonth(date.split(' ')[1]);
    var year = date.split(' ')[2];

    if (days.length < 2) {
        days = '0' + days;
    }

    return `${year}-${month}-${days}`;
}

function convertFromRegex2(date) {
    var day1 = date.split('-')[0];
    var day2 = new RegExp('[-][0-3]?\\d{1}').exec(date)[0].slice(1);
    var month = new RegExp('(ian|feb|mar|apr|mai|iun|iul|aug|sep|nov|dec)').exec(date)[0];
    var year = new RegExp('\\d{4}').exec(date)[0];

    var date1 = `${day1} ${month} ${year}`;
    var date2 = `${day2} ${month} ${year}`;

    return convertFromRegex1(date1) + '/' + convertFromRegex1(date2);
}

function convertFromRegex3(date) {
    var date1 = date.split(' - ')[0] + ' ' + new RegExp('\\d{4}').exec(date)[0];
    var date2 = date.split(' - ')[1];

    return convertFromRegex1(date1) + '/' + convertFromRegex1(date2);
}

function convertFromRegex4(date) {
    var date1 = date.split(' - ')[0];
    var date2 = date.split(' - ')[1];

    return convertFromRegex1(date1) + '/' + convertFromRegex1(date2);
}

function convertDate(date) {
    var convertedDate;
    if (supportedDateFormatsRegex.format1.test(date)) {
        convertedDate = convertFromRegex1(date);
    }

    if (supportedDateFormatsRegex.format2.test(date)) {
        convertedDate = convertFromRegex2(date);
    }

    if (supportedDateFormatsRegex.format3.test(date)) {
        convertedDate = convertFromRegex3(date);
    }

    if (supportedDateFormatsRegex.format4.test(date)) {
        convertedDate = convertFromRegex4(date);
    }

    if (!convertedDateRegex.test(convertedDate) && !convertedDateIntervalRegex.test(convertedDate)) {
        console.log('Date is in the wrong format: ', convertedDate);
    }

    return convertedDate;
}

function convertDatesToLinks() {

    var hotel = $('#hotel').val();
    var departureAirport = $('#departureAirport').val();
    var destinationAirport = $('#destinationAirport').val();
    var destination = $('#destination').val();
    var dates = $('#dates').val().split(/\n/);

    var links = dates.map(function (date) {
        var convertedDate = convertDate(date);

        return generateLink(hotel, departureAirport, destinationAirport, destination, date, convertedDate);
    });

    $('#links').val(links.join('\n'));
    $('#linksContainer').show();
}