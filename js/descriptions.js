function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});




}

function search(tweet_array){
	// searches for word in a tweet and returns an array of objects after cleaning it
	var user_tweets = [];
	for (let i = 0; i < tweet_array.length; i++){
		if (tweet_array[i].written){
			user_tweets.push({index: 0, activity: tweet_array[i].activityType, message: tweet_array[i].text});
		}
	}

	var input = document.getElementById('textFilter').value;

	if (input == "") {
		return [];
	}

	document.getElementById("searchText").innerText = input;
	input = input.toLowerCase();


	var search_results = [];
	var counter = 1;

	for (let i = 0; i < user_tweets.length; i++){
		if (user_tweets[i].message.toLowerCase().includes(input)){
			user_tweets[i].index = counter;
			search_results.push(user_tweets[i])
			counter += 1;
		}
	}

	let num_tweets = document.getElementById("searchCount");
	num_tweets.textContent = counter - 1;

	return search_results;

}

function column_adder(search_query){
	//adds the found results to the columns in the search dom
	var tbody = document.getElementById('tweetTable');

	if (tbody){
		tbody.innerHTML = "";
		search_query.forEach((message) => {
			let row = tbody.insertRow();
			row.insertCell().textContent = message.index;
			row.insertCell().textContent = message.activity;
			row.insertCell().textContent = message.message;
		});

	}
	
}

function addEventHandlerForSearch() {
	// calls search and column_adder on input event
	var search_bar = document.getElementById('textFilter');

	search_bar.addEventListener('input', () =>  {
		var results = search(tweet_array);
		column_adder(results);

	});

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});