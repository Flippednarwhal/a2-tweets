function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	var completed = 0;
	var achieved = 0;
	var live = 0;
	var miscellaneous = 0;

	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// retrieves and sets the earliest and latest dates of tweets on front page
	first_last(tweet_array);
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
}

function first_last(tweet_array) {
	var latest = tweet_array.at(0).time;
	var earliest = tweet_array.at(-1).time;

	var early_date = document.getElementById('firstDate');
	early_date.textContent = earliest.toLocaleDateString();
	
	var late_date = document.getElementById('lastDate');
	late_date.textContent = latest.toLocaleDateString();
	return;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});