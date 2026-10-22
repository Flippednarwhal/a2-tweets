function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded

	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});




	// retrieves and sets the earliest and latest dates of tweets on front page
	first_last(tweet_array);
	
	var writ = 0;
	var not_writ = 0;

	for (i = 0; i < tweet_array.length; i++){

		if (tweet_array[i].written){
			writ += 1;
		}

		else if (tweet_array[i].text.includes("Check it out!")){
			not_writ += 1;
		}

	}

	


	event_num(tweet_array);

	

	

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
}



function tweet_written(tweet_array){
	let writ_counter = 0;

	for (i = 0; i < tweet_array.length; i++){
		if (tweet_array[i].written) {
			writ_counter += 1;
		}
	}

	return writ_counter;
}



// Loop (maybe done in parseTweets) through tweet_array and tick individual counter depending on each tweet object contents
function event_num(tweet_array){
	var counter = {completed: 0, achieved: 0, live: 0, misc: 0};

	for (i = 0; i < tweet_array.length; i++) {


		if (tweet_array[i].source == 'completed_event') {
			counter.completed += 1;
		}

		else if (tweet_array[i].source == 'live_event') {
			counter.live += 1;
		}

		else if (tweet_array[i].source == 'achievement') {
			counter.achieved += 1;
		}

		else if (tweet_array[i].source == 'miscellaneous') {
			counter.misc += 1;
		}

	}


	var total = counter.completed + counter.achieved + counter.live + counter.misc;

	var user_tweet = tweet_written(tweet_array);
 
	var complete_arr = document.getElementsByClassName('completedEvents');
	var complete_pct = document.getElementsByClassName('completedEventsPct');
	var live_arr = document.getElementsByClassName('liveEvents');
	var live_pct = document.getElementsByClassName('liveEventsPct');
	var achieve_arr = document.getElementsByClassName('achievements');
	var	achieve_pct = document.getElementsByClassName('achievementsPct');
	var miscellaneous_arr = document.getElementsByClassName('miscellaneous');
	var	miscellaneous_pct = document.getElementsByClassName('miscellaneousPct');
	var user_arr = document.getElementsByClassName('written');
	var	user_pct = document.getElementsByClassName('writtenPct');

	for (i = 0; i < user_arr.length; i++) {
		user_arr[i].textContent = user_tweet;
	}

	for (i = 0; i < user_pct.length; i++) {
		user_pct[i].textContent = to_percent(user_tweet, counter.completed) + '%';
	}
	
	for (i = 0; i < complete_arr.length; i++) {
		complete_arr[i].textContent = counter.completed;
	}

	
	for (i = 0; i < complete_pct.length; i++) {
		complete_pct[i].textContent = to_percent(counter.completed, total) + '%';
	}

	for (i = 0; i < live_arr.length; i++) {
		live_arr[i].textContent = counter.live;
	}

	for (i = 0; i < live_pct.length; i++) {
		live_pct[i].textContent = to_percent(counter.live, total) + '%';
	}

	for (i = 0; i < achieve_arr.length; i++) {
		achieve_arr[i].textContent = counter.achieved;
	}

	for (i = 0; i < achieve_pct.length; i++) {
		achieve_pct[i].textContent = to_percent(counter.achieved, total) + '%';
	}

	for (i = 0; i < miscellaneous_arr.length; i++) {
		miscellaneous_arr[i].textContent = counter.misc;
	}

	for (i = 0; i < miscellaneous_pct.length; i++) {
		miscellaneous_pct[i].textContent = to_percent(counter.misc, total) + '%';
	}

	return;

}




function to_percent(event, total) {
	var event = (event / total) * 100;
	var percent = event.toFixed(2);

	return percent;

}

function first_last(tweet_array) {
	var latest = tweet_array.at(0).time;
	var earliest = tweet_array.at(-1).time;

	var early_date = document.getElementById('firstDate');
	let options = {weekday: "long", year: "numeric", month:"long", day:"numeric"}
	early_date.textContent = earliest.toLocaleDateString(undefined, options);
	
	var late_date = document.getElementById('lastDate');
	late_date.textContent = latest.toLocaleDateString(undefined, options);
	return;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});