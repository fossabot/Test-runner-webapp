// TODO: mape the objects of Team and Task from locations  and evals to be the same in runs 
// NOTE: is there a better way to handle the consitent Keys of ( 'runs','configs', 'evals', 'location')
var allthings = {
	runs: [],
	configs: [],
	evals: [],
	locations: [],
}
/*
Description: Runs on page to process what page to show
 Also handles loading LocalStorage loading from old content
Parameters: 
Return: 
*/
document.onreadystatechange = () => {
	console.log("Step 0");
	showPage(1);
	if (localStorage.allthings !== undefined) {
		allthings = returnallfromlocalstorage();
		rerenderall();
	}
};
// #TODO: Create a way to illustrate that the back button is not an option
/* 
  Description:
    This is the paging function, has a value of all page ids
    stored in an array and then will show or hide the neccessary 
    elements. This effect will create the Paging effect
  Parameters: Takes the page value of 1,2, ... 6 
  Returns: Nothing
*/
function showPage(page) {
	const pages = ['home', 'evaluationPage', 'elist', 'gpsPage', 'configurationPage'];
	let i = 0;
	for (i; i < pages.length; i += 1) {
		if (page === i + 1) {
			document.getElementById(pages[i]).style.display = 'block';
			location.hash = `${pages[i]}`;
		} else {
			document.getElementById(pages[i]).style.display = 'none';
		}
	}
}
/*s
Description: 
Parameters: 
Return: 
*/
// DEBUG: the onhash change event dosent get called on the url changing but gets called only on page refresh/reload
setTimeout(hashCheck(window.location.hash), 100);

function hashCheck(hash) {
	console.log("running func");
	if (hash != window.location.hash) {
		console.log("triggered onhaschange: " + window.location.href + " and " + window.location.hash);
	}
}
/* 
Description:
  Iterate the elements of a form ID 
  (don't give the hash in front),
  and return as a key-value object where 
  key is name and value is ... value ... 
  from each form element.
Parameters: one of 'runs', 'configs', 'evals', 'locations'
Returns: the key:value object (like {team:"NERVE", task:"1-1A-1"} )
*/
function getObjectFromForm(idname) {
	var x = document.getElementById(idname);
	var e = x.elements;
	var kvobject = {};
	for (var i = 0; i < e.length; i++) {
		if (e[i].tagName == "BUTTON" || e[i].type == "submit") continue;
		kvobject[e[i].name] = e[i].value;
  }
  console.log("Step 1");
	return kvobject;
}
/* 
Description:
  Save a form to the master storage object (global).
  Saves to localstorage
  Then removes all elements and shows all elements in Array 
Parameters: one of 'runs', 'configs', 'evals', 'locations'
Returns: nothing
*/
function saveToArray(thingtosave) {
	var nameformidmap = {
		'runs': 'runform',
		'evals': 'evaluationForm',
    'configs': 'configurationForm',
    'locations': 'gpsform'
	} //TODO add to here for locations
  event.preventDefault();
  console.log("Step 2");
	console.log(thingtosave);
	var o = getObjectFromForm(nameformidmap[thingtosave]);
  allthings[thingtosave].push(o);
  console.log(o);
	savealltolocalstorage();
	rerenderall();
}
/*
Description:
  removeElementFromAllThings -> delete one element from the thingtype array and re-saves to localStorage
Parameters:
  index to delete
  thingtype is one of 'runs', 'configs', 'evals', 'locations'
returns: thing removed
*/
function deleteElementFromAllThings(thingtype, idx) {
  console.log(`Step 6.delete.${thingtype}`)
	var x = allthings[thingtype].splice(idx, 1);
	rerenderall(); //TODO - make this better?
	savealltolocalstorage();
	return x;
}
/*
Description: Function for master rerender
Parameters: 
Return: 
*/
function rerenderall() {
  console.log("Step 4");
  rerenderElements('runs');
  rerenderElements('configs');
  rerenderElements('evals');
  rerenderElements('locations');
}
/*
Description: saves global array to localStorage 
Parameters: 
Return: 
*/
function savealltolocalstorage() {
  console.log("Step 3")
	localStorage.setItem("allthings", JSON.stringify(allthings));
}
/*
Description: loads the allthings localStorage object to the allthings gloabl objects
Parameters: 
Return: 
*/
function returnallfromlocalstorage() {
  console.log("Step 5")
	return JSON.parse(localStorage.getItem("allthings"));
}
/*
Description:  rerenders the specific elements by key value 
Parameters:  a key value of ( 'runs', 'configs', 'evals', 'locations' )
Return: 
*/
// REVIEW: there must be a better way to solve this then the IFs
function rerenderElements(kv) {
	var nameformidmap = {
		'runs': 'runlist',
		'evals': 'evaluationlist',
    'configs': 'configlist',
    'locations': 'locationslist'
	}
  var list = document.getElementById(nameformidmap[kv]);
  console.log(`${kv} = ${list}`)
	list.innerHTML = "";
	if (kv === 'runs') {
    console.log("Step 4.runs");
		createRunElements();
	} else if (kv == 'configs') {
    console.log("Step 4.configs");
		createConfigElements();
	} else if (kv == 'evals') {
    console.log("Step 4.evals");
		createEvalElements()
	} else if (kv == 'locations') {
    console.log("Step 4.locations");
		createLocationElements()
	}
}
/*
Description: 
Parameters: 
Return: 
*/
// TODO: Create a function to create all configs, evals, and locations
function createRunElements() {
  console.log("Step 4.runs.create");
	var runList = document.getElementById('runlist');
	for (x = 0; x < allthings.runs.length; x += 1) {
		let teamValue = allthings.runs[x].team;
		let taskValue = allthings.runs[x].task;
		var template = `
    <!--- Start of a single Run -->
   <div id="run${x}">
                <div class="ui two top attached buttons">
                        <button class="ui green button" onclick="showPage(4)">GPS</button>
                    </div>
                <div class=" ui two column grid  attached  segment">
                <div class="column">
                    <div class="ui blue  large label">
                            ${teamValue}
                    </div>
                    <br />
                    <div class="ui  small label">
                        Team
                    </div>
                </div>
                <div class="column">
                    <div class="ui blue  large label">
                            ${taskValue}
                    </div>
                    <br/>
                    <div class="ui  small label">
                        Task
                    </div>
                </div>
            </div>
            <div class="ui two bottom attached buttons">
                    <button class="ui red button" onclick="deleteElementFromAllThings('runs',${x})">Delete</button>
                    <button class="ui purple button" onclick="showPage(2)">Edit</button>
            </div>
        </div>
    <!-- End of a single Run -->
    `;
		if (x === 0) {
			runList.innerHTML = template;
		} else if (x !== null || x > 0) {
			document.getElementById(`run${x - 1}`).insertAdjacentHTML('afterend', template);
		}
	}
}


function createConfigElements() {
  console.log("Step 4.configs.create");
	var configlist = document.getElementById('configlist');
	for (x = 0; x < allthings.configs.length; x += 1) {
		let teamValue = allthings.configs[x].team;
		let nameValue = allthings.configs[x].name;
		let rotorsValue = allthings.configs[x].rotors;
		let batteryValue = allthings.configs[x].battery;
		let flightControllerValue = allthings.configs[x].flightController;
		let heightValue = allthings.configs[x].height;
		let weightValue = allthings.configs[x].weight;
		let notesValue = allthings.configs[x].notes;
    var template = `<!--- Start of a single config -->
    <div id="configs${x}">
        <div class="ui four column grid  attached  blue segment">
        <div class="column">
            <div class="ui blue  large label">
                ${teamValue}
            </div>
            <br />
            <div class="ui  small label">
                Team
            </div>
        </div>
        <div class="column">
            <div class="ui blue  large label">
                ${nameValue}
            </div>
            <br/>
            <div class="ui  small label">
                Name
            </div>
        </div>
        <div class="column">
            <div class="ui blue large label">
                ${rotorsValue}
            </div>
            <br/>
            <div class="ui   small label">
                Rotors
            </div>
        </div>
        <div class="column">
            <div class="ui blue large label">
                ${batteryValue}
            </div>
            <br/>
            <div class="ui   small label">
                Battery
            </div>
        </div>
        <div class="column">
            <div class="ui blue large label">
                ${flightControllerValue}
            </div>
            <br/>
            <div class="ui small label">
                Flight Controller
            </div>
        </div>
        <div class="column">
            <div class="ui blue large label">
                ${heightValue}
            </div>
            <br/>
            <div class="ui  label">
                Height
            </div>
        </div>
        <div class="column">
            <div class="ui blue large label">
                ${weightValue}
            </div>
            <br/>
            <div class="ui  label">
                Weight
            </div>
        </div>
        <div class="column">
            <div class="ui blue large label">
                ${notesValue}
            </div>
            <br/>
            <div class="ui  label">
                Notes
            </div>
        </div>
        </div>
        <div class="ui two bottom attached buttons">
            <button class="ui  purple button" onclick="showPage(5)">Edit</button>
            <button class="ui  red button" onclick="deleteElementFromAllThings('configs',${x})">Delete</button>
        </div>
    </div>`;
		if (x === 0) {
			configlist.innerHTML = template;
		} else if (x !== null || x > 0) {
			document.getElementById(`configs${x - 1}`).insertAdjacentHTML('afterend', template);
		}
	}
}

function createEvalElements() {
  console.log("Step 4.evals.create");
	var evlauationlist = document.getElementById('evaluationlist');
	for (x = 0; x < allthings.evals.length; x += 1) {
		let teamValue = allthings.evals[x].team;
		let taskValue = allthings.evals[x].task;
		let resultValue = allthings.evals[x].result;
		let percentValue = allthings.evals[x].percent;
		let flightControllerValue = allthings.evals[x].flightController;
		let configValue = allthings.evals[x].config;
		let timeValue = allthings.evals[x].time;
		let goaltimeValue = allthings.evals[x].goaltime;
		let notesValue = allthings.evals[x].notes;
    var template = `<div id="evaluation${x}" class="ui">
    <div class=" ui four column grid  attached  blue segment">
        <div class="column">
            <div class="ui blue  large label">
                ${teamValue}
            </div>
            <br />
            <div class="ui  small label">
                Team
            </div>
        </div>
        <div class="column">
            <div class="ui blue  large label">
                ${taskValue}
            </div>
            <br/>
            <div class="ui  small label">
                Task
            </div>
        </div>
        <div class="column">
            <div class="ui blue large label">
                ${resultValue}
            </div>
            <br/>
            <div class="ui   small label">
                Result
            </div>
        </div>
        <div class="column">
            <div class="ui blue large label">
                ${percentValue}
            </div>
            <br/>
            <div class="ui small label">
                Success Percent
            </div>
        </div>
        <div class="column">
            <div class="ui blue large label">
                ${configValue}
            </div>
            <br/>
            <div class="ui  label">
                Config
            </div>
        </div>
        <div class="column">
            <div class="ui blue large label">
                ${timeValue}
            </div>
            <br/>
            <div class="ui  label">
                Total Time
            </div>
        </div>
        <div class="column">
            <div class="ui blue large label">
                ${goaltimeValue}
            </div>
            <br/>
            <div class="ui  label">
                Goal Time
            </div>
        </div>
        <div class="column">
            <div class="ui blue large label">
               ${notesValue}
            </div>
            <br/>
            <div class="ui  label">
                Notes
            </div>
        </div>
    </div>
    <div class="ui two bottom attached buttons">
        <button class="ui  red button" onclick="deleteElementFromAllThings('evals',${x}) ">Delete</button>
        <button class="ui  purple button" onclick="showPage(2) ">Edit</button>
    </div>
</div>`;
		if (x === 0) {
			evaluationlist.innerHTML = template;
		} else if (x !== null || x > 0) {
			document.getElementById(`evals${x - 1}`).insertAdjacentHTML('afterend', template);
		}
	}
}

function createLocationElements() {
  console.log("Step 4.locations.create");
	var locationlist = document.getElementById('locationlist');
	for (x = 0; x < allthings.locations.length; x += 1) {
		let teamValue = allthings.locations[x].team;
		let taskValue = allthings.locations[x].task;
    let latValue = allthings.locations[x].latitude;
    let longValue = allthings.locations[x].longitude;
    var template = `<div id="evaluation${x}" class="ui">
    <div class=" ui four column grid  attached  blue segment">
        <div class="column">
            <div class="ui blue  large label">
                ${teamValue}
            </div>
            <br />
            <div class="ui  small label">
                Team
            </div>
        </div>
        <div class="column">
            <div class="ui blue  large label">
                ${taskValue}
            </div>
            <br/>
            <div class="ui  small label">
                Task
            </div>
        </div>
        <div class="column">
            <div class="ui blue large label">
                ${latValue}
            </div>
            <br/>
            <div class="ui   small label">
                Latitude
            </div>
        </div>
        <div class="column">
            <div class="ui blue large label">
                ${longValue}
            </div>
            <br/>
            <div class="ui small label">
               Longitude
            </div>
        </div>
        </div>
    </div>
    <div class="ui two bottom attached buttons">
        <button class="ui  red button" onclick="deleteElementFromAllThings('locations',${x}) ">Delete</button>
    </div>
</div>`;
		if (x === 0) {
			locationslist.innerHTML = template;
		} else if (x !== null || x > 0) {
			document.getElementById(`locations${x - 1}`).insertAdjacentHTML('afterend', template);
		}
	}
  
}