var events = [{
	event: "ComicCon",
	city: "New York",
	state: "New York",
	attendance: 240000,
	date: "06/01/2017",
},
{
	event: "ComicCon",
	city: "New York",
	state: "New York",
	attendance: 250000,
	date: "06/01/2018",
},
{
	event: "ComicCon",
	city: "New York",
	state: "New York",
	attendance: 257000,
	date: "06/01/2019",
},
{
	event: "ComicCon",
	city: "San Diego",
	state: "California",
	attendance: 130000,
	date: "06/01/2017",
},
{
	event: "ComicCon",
	city: "San Diego",
	state: "California",
	attendance: 140000,
	date: "06/01/2018",
},
{
	event: "ComicCon",
	city: "San Diego",
	state: "California",
	attendance: 150000,
	date: "06/01/2019",
},
{
	event: "HeroesCon",
	city: "Charlotte",
	state: "North Carolina",
	attendance: 40000,
	date: "06/01/2017",
},
{
	event: "HeroesCon",
	city: "Charlotte",
	state: "North Carolina",
	attendance: 45000,
	date: "06/01/2018",
},
{
	event: "HeroesCon",
	city: "Charlotte",
	state: "North Carolina",
	attendance: 50000,
	date: "06/01/2019",
},
];

// dropdown for specific cities

function buildDropDown() {
	let dropdownMenu = document.getElementById('eventDropDown');
	dropdownMenu.innerHTML = '';

	let currentEvents = getEventData(); // TODO - get these from storage

	let cityNames = currentEvents.map(event => event.city);
	let citiesSet = new Set(cityNames);
	let distictCities = [...citiesSet];

	const dropdownTemplate = document.getElementById('dropdownItemTemplate');

	//copy the template
	let dropdownItemNode = document.importNode(dropdownTemplate.content, true);

	//make our changes
	let dropdownItemLink = dropdownItemNode.querySelector('a');
	dropdownItemLink.innerText = 'All Cities';
	dropdownItemLink.setAttribute('data-string', 'All')

	//add our copy to the page
	dropdownMenu.appendChild(dropdownItemNode);


	for (let i = 0; i < distictCities.length; i += 1) {
		// get city name
		let cityName = distictCities[i];

		// generate drop down element
		let itemNode = document.importNode(dropdownTemplate.content, true);
		let anchorTag = itemNode.querySelector('a');
		anchorTag.innerText = cityName;
		anchorTag.setAttribute('data-string', cityName);

		// append to drop down menu
		dropdownMenu.appendChild(itemNode);
	}

	displayEventData(currentEvents);
	displayStats(currentEvents);
	document.getElementById('location').innerText = 'All Events';
}


function displayEventData(currentEvents) {


	const eventTable = document.getElementById('eventTable');
	const template = document.getElementById('tableRowTemplate');

	eventTable.innerHTML = '';

	for (let i = 0; i < currentEvents.length; i++) {
		let event = currentEvents[i];
		let tableRow = document.importNode(template.content, true);

		tableRow.querySelector('[data-id="event"]').textContent = event.event;
		tableRow.querySelector('[data-id="city"]').textContent = event.city;
		tableRow.querySelector('[data-id="state"]').textContent = event.state;
		tableRow.querySelector('[data-id="attendance"]').textContent = event.attendance.toLocaleString();
		tableRow.querySelector('[data-id="date"]').textContent = new Date(event.date).toLocaleDateString();

		tableRow.querySelector('tr').setAttribute('data-event', event.id);

		eventTable.appendChild(tableRow);

	}
}



function calculateStats(currentEvents) {
	let total = 0;
	let average = 0;
	let most = 0;
	let least = currentEvents[0].attendance;

	for (let i = 0; i < currentEvents.length; i++) {
		let currentAttendance = currentEvents[i].attendance;

		total += currentAttendance;

		if (currentAttendance > most) {
			most = currentAttendance;
		}
		if (currentAttendance < least) {
			least = currentAttendance;
		}

	}

	average = total / currentEvents.length;

	let stats = {
		total: total,
		average: average,
		most: most,
		least: least,

	}

	return stats;
}


function displayStats(currentEvents) {
	let statistics = calculateStats(currentEvents);

	//get elemetns where the stats go
	// set their text to be the correct stat from statistics

	document.getElementById('total').textContent = statistics.total.toLocaleString();
	document.getElementById('average').textContent = Math.round(statistics.average).toLocaleString();
	document.getElementById('most').textContent = statistics.most.toLocaleString();
	document.getElementById('least').textContent = statistics.least.toLocaleString();


}


function getEventData() {
	let data = localStorage.getItem('ghSuperDogEventData');

	if (data == null) {
		let identifiedEvents = events.map((event) => {
			event.id = generateId();
			return event;
		});

		localStorage.setItem('ghSuperDogEventData', JSON.stringify(identifiedEvents));
		data = localStorage.getItem('ghSuperDogEventData');
	}

	let currentEvents = JSON.parse(data);

	if (currentEvents.some(event => event.id == undefined)) {

		currentEvents.forEach(event => event.id = generateId());

		localStorage.setItem('ghSuperDogEventData', JSON.stringify(currentEvents));

	}

	return currentEvents;
}


function viewFilteredEvents(dropdownItem) {
	let cityName = dropdownItem.getAttribute('data-string');

	//get all events
	let allEvents = getEventData();

	if (cityName == 'All') {
		displayStats(allEvents);
		displayEventData(allEvents);
		document.getElementById('location').innerText = 'All Events'

		return;
	}

	//filter those events to just the selected city
	let filteredEvents = allEvents.filter(event => event.city.toLowerCase() == cityName.toLowerCase());

	//display the stats for those events
	displayStats(filteredEvents);

	// change the stats header
	document.getElementById('location').innerText = cityName;

	// display only those events in the table
	displayEventData(filteredEvents);
}


function saveNewEvent() {
	// get the form input values
	let name = document.getElementById('newEventName').value;
	let city = document.getElementById('NewEventCity').value;
	let attendance = parseInt(document.getElementById('newEventAttendance').value);

	let dateValue = document.getElementById('newEventDate').value;
	dateValue = new Date(dateValue + ' 00:00');

	let date = dateValue.toLocaleString();

	let stateSelect = document.getElementById('newEventState');
	let stateIndex = stateSelect.selectedIndex;
	let state = stateSelect.options[stateIndex].text;

	//create a new event object
	let newEvent = {
		event: name,
		city: city,
		state: state,
		attendance: attendance,
		date: date
	};

	// add it to the array of current events
	let events = getEventData();
	events.push(newEvent);

	//then, save the array with the new event
	localStorage.setItem('ghSuperDogEventData', JSON.stringify(events));

	buildDropDown();
}


function ClearFields() {

	document.getElementById("newEventName").value = "";
	document.getElementById("NewEventCity").value = "";
	document.getElementById("newEventState").value = "";
	document.getElementById("newEventAttendance").value = "";
	document.getElementById("newEventDate").value = "";
}


function generateId() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}


function editEvent(eventRow) {
	let eventId = eventRow.getAttribute('data-event');

	let currentEvents = getEventData();

	let eventToEdit = currentEvents.find(eventObject => eventObject.id == eventId)

	document.getElementById('editEventId').value = eventToEdit.id;
	document.getElementById('editEventName').value = eventToEdit.event;
	document.getElementById('editEventCity').value = eventToEdit.city;
	document.getElementById('editEventAttendance').value = eventToEdit.attendance;


	//format date
	let eventDate = newDate(eventToEdit.date);
	let eventDateString = eventDate.toISOString();
	let dateArray = eventDateString.split('T');
	let formattedDate = dateArray[0];

	document.getElementById('editEventDate').value = formattedDate;

	//format state

	let editStateSelect = document.getElementById('editEventState');

	// loop to find the option
	for (let i = 0; i < editStateSelect.options.length; i++) {
		let option = editStateSelect.options[i];

		if (eventToEdit.state == option.text) {
			editStateSelect.selectedIndex = i;
		}
	}

}


function deleteEvent() {

	let eventId = document.getElementById('editEventId').value;

	let currentEvents = getEventData();

	let filteredEvents = currentEvents.filter(event => event.id != eventId);

	localStorage.setItem('ghSuperDogEventData', JSON.stringify(filteredEvents));

	buildDropDown();

}


function updateEvent() {
	// get the form input values
	let name = document.getElementById('editEventName').value;
	let city = document.getElementById('editEventCity').value;
	let attendance = parseInt(document.getElementById('editEventAttendance').value);
	let eventId = document.getElementById('editEventId').value;

	let dateValue = document.getElementById('editEventDate').value;
	dateValue = new Date(dateValue + ' 00:00');

	let date = dateValue.toLocaleString();

	let stateSelect = document.getElementById('editEventState');
	let stateIndex = stateSelect.selectedIndex;
	let state = stateSelect.options[stateIndex].text;

	//create a new event object
	let newEvent = {
		event: name,
		city: city,
		state: state,
		attendance: attendance,
		date: date,
		id: eventId
	};

	let currentEvents = getEventData();

	for (i = 0; i < currentEvents.length; i++) {
		if (currentEvents[i].id == eventId) {
			currentEvents[i] = newEvent;
			break;
		}
	}

	localStorage.setItem('ghSuperDogEventData', JSON.stringify(currentEvents));

	buildDropDown();


}