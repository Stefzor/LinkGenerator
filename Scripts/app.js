$(document).ready(function () {
    var departureAirportContainer = $('#departureAirportContainer');
    var destinationAirportContainer = $('#destinationAirportContainer');
    var hotelContainer = $('#hotelContainer');
    
    destinationAirportContainer.show();
    departureAirportContainer.show();
    hotelContainer.hide();

    $('input[type=radio][name=mode]').change(function () {
            destinationAirportContainer.toggle();
            departureAirportContainer.toggle();
            hotelContainer.toggle();
    });
});

function generateFlightLink(departureAirport, destinationAirport, destination, date) {
    return `https://www.momondo.ro/in?a=travelator&url=/flight-search/${departureAirport}-${destinationAirport}/${date}?sort=price_a&encoder=27_1&enc_pid=deeplinks&enc_eid=0&enc_lid=${destination}&enc_cid=article&utm_source=travelator&utm_medium=affiliate&utm_term=rev&utm_campaign=deeplinks&utm_content=${destination}`;
}

function generateLodgingsLink(affiliateTag, destination, date) {
    return `https://www.momondo.ro/in?a=travelator&url=/hotels/${affiliateTag}/${date}/2adults?sort=price_a&encoder=27_1&enc_pid=deeplinks&enc_eid=0&enc_lid=${destination}&enc_cid=article&utm_source=travelator&utm_medium=affiliate&utm_term=rev&utm_campaign=deeplinks&utm_content=${destination}`;
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

function convertToDesiredDateFormat(date) {
    var days = date.split(' ')[0];
    var month = convertMonth(date.split(' ')[1]);
    var year = date.split(' ')[2];

    if (days.length > 2) {
        var day1 = days.split('-')[0];
        var day2 = days.split('-')[1];
        if (day1.length < 2) {
            day1 = '0' + day1;
        }
        if (day2.length < 2) {
            day2 = '0' + day2;
        }
        return year + '-' + month + '-' + day1 + '/' +
            year + '-' + month + '-' + day2;
    } else if (days.length === 2) {
        return year + '-' + month + '-' + days;
    } else {
        return year + '-' + month + '-0' + days;
    }
}

function convertDatesToLinks() {

    var mode = $('input[type=radio][name=mode]:checked').val();
    var hotel = $('#hotel').val();
    var departureAirport = $('#departureAirport').val();
    var destinationAirport = $('#destinationAirport').val();
    var destination = $('#destination').val();
    var dates = $('#dates').val().split(/\n/);

    var links = dates.map(function (date) {
        if (date.trim().length <= 14) {
            var convertedDate = convertToDesiredDateFormat(date);

            if (mode === 'flight') {
                return generateFlightLink(departureAirport, destinationAirport, destination, convertedDate);
            } else if (mode === 'lodgings') {
                return generateLodgingsLink(hotel, destination, convertedDate);
            }

        } else {
            var startDate = date.split(' - ')[0];
            var endDate = date.split(' - ')[1];
            if (startDate.length < 11) {
                startDate += ' ' + endDate.split(' ')[2];
            }
            var convertedDate = convertToDesiredDateFormat(startDate) + '/' + convertToDesiredDateFormat(endDate);

            if (mode === 'flight') {
                return generateFlightLink(departureAirport, destinationAirport, destination, convertedDate);
            } else if (mode === 'lodgings') {
                return generateLodgingsLink(hotel, destination, convertedDate);
            }
        }
    });

    $('#links').val(links.join('\n'));
    $('#linksContainer').show();
}