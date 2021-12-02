

// Foursquare API Info
const clientId = 'YOUR CLIENT ID';
const clientSecret = 'YOUR CLIENT SECRET';
const authorization = 'YOUR AUTHORIZATION';
const url = 'https://api.foursquare.com/v3/places/search?near=';
const urlImage = 'https://api.foursquare.com/v3/places/';



// OpenWeather Info
const openWeatherKey = 'YOUR KEY';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4"), $("#venue5")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Options required for the four square API version 3
const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    Authorization: authorization
  }
};

// Add AJAX functions here:
const getVenues = async () => {
	const city = $input.val();
	const urlToFetch = `${url}${city}&limit=10`;
  try{
    const response = await fetch(urlToFetch, options);
    if (response.ok){
      const jsonResponse = await response.json();
      const venues = jsonResponse.results.map(item => item)
      return venues;
    }
  }catch(error){
    console.log(error);
  };
}

//Get the image required
const getImages = async(venues) => { 
  for(let index = 0; index <4; index++){
    venueId = venues[index].fsq_id;
    const urlToFetch = `${urlImage}${venueId}/photos?limit=1`;
    try{
      const response = await fetch(urlToFetch,options);
      if (response.ok){
        const jsonResponse = await response.json();
        const venuesImages = jsonResponse
        const urlImage = `${venuesImages[0].prefix}200x200${venuesImages[0].suffix}`;
      }
    }catch(error){
      console.log(error)
    }
  }; 
}

const getIndividualImage = async(venue) =>{
  venueId = venue.fsq_id;
  const urlToFetch = `${urlImage}${venueId}/photos?limit=1`;
  try{
    const response = await fetch(urlToFetch,options);
    if (response.ok){
      const jsonResponse = await response.json();
      const venuesImages = jsonResponse
      const urlImage = `${venuesImages[0].prefix}200x200${venuesImages[0].suffix}`;
      return urlImage;
    }
  }catch(error){
    console.log(error)
  }
}


// Get Weather API
const getForecast = async() => {
  const city = $input.val();
  const urlToFetch = `${weatherUrl}?q=${city}&appid=${openWeatherKey}`;
  try{
    const response = await fetch(urlToFetch);
    if (response.ok){
      const jsonResponse = await response.json();
      return jsonResponse;
    }

  }catch(error){
    console.log(error);
  }
}


// Render functions
const renderVenues = async(venues) => {
  for (let index=0; index <$venueDivs.length; index++) {
    // Add your code here:
    const venue = venues[index];
    const venueName = venue.name
    const venueLocation = venue.location
    const venueIcon = venue.categories[0].icon;
    const venuefsq_id = venue.fsq_id;
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;    
    const imageFinal = await getIndividualImage(venue);
    let venueContent = createVenueHTML(venueName, venueLocation, venueImgSrc, imageFinal);
    $venueDivs[index].append(venueContent);
  };
  $destination.append(`<h2>${$input.val()}</h2>`);
};



const renderForecast = (day) => {
  // Add your code here:
	let weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty(); 
  $container.css("visibility", "visible");
  getVenues().then(venues=>renderVenues(venues));
  getForecast().then(day=>renderForecast(day))
  return false;
}


$submit.click(executeSearch)