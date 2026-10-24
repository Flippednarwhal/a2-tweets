function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});


	var weekdays = weekday(tweet_array);
	var weekends = weekend(tweet_array);

	var longest_week_act = weekday_vs_weekend(weekdays, weekends);

	var total_activites = activity_stats(tweet_array);




	var total_dis = total_distance(tweet_array);



	var popular_act = filter_popular(total_activites);

	var longest = longest_distance(popular_act, total_dis);
	var shortest = shortest_distance(popular_act, total_dis);


	var all_act = document.getElementById('numberActivities');
	all_act.textContent = Object.keys(total_activites).length;

	var most_pop_act1 = document.getElementById('firstMost');
	most_pop_act1.textContent = Object.keys(popular_act)[0];

	var most_pop_act2 = document.getElementById('secondMost');
	most_pop_act2.textContent = Object.keys(popular_act)[1];

	var most_pop_act3 = document.getElementById('thirdMost');
	most_pop_act3.textContent = Object.keys(popular_act)[2];

	var longest_act = document.getElementById('longestActivityType');
	longest_act.textContent = longest;

	var shortest_act = document.getElementById('shortestActivityType');
	shortest_act.textContent = shortest;

	var longest_week_dis = document.getElementById('weekdayOrWeekendLonger');
	longest_week_dis.textContent = longest_week_act;



	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	var graph_act = [];


	for ([key, value] of Object.entries(total_activites)){
		graph_act.push({"activity": key, "amount": value})
	}


	
	var graph_popular = [];


	for ([key, value] of Object.entries(popular_act)){
		graph_popular.push(key);
	}

	var days_graph = day_distance(tweet_array, graph_popular);





	console.log(days_graph);

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": graph_act
	  },
	  "mark": "bar",
	  "encoding": {
		"x": {"field": "activity", "type": "nominal"},
		"y": {"field": "amount", "type": "quantitative"}
	  },
	  //TODO: Add mark and encoding
	};

	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": days_graph
	  },
	  "mark": "point",
	  "encoding": {
		"x": {"timeUnit": "day", "field": "day", "type": "nominal"},
		"y": {"field": "distance", "type": "quantitative"},
		"color" : {"field": "activity", "type": "nominal"}
	  },
	  "color" : {"field": "activity", "type": "nominal"}
	  //TODO: Add mark and encoding
	};

	

	

	

	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});


	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

function day_distance(tweet_array, activities){

	var act_counter = [];

	for (let i = 0; i < tweet_array.length; i++){
		let val = tweet_array[i].activityType;

		if (val == activities[0]){
			act_counter.push({"activity": activities[0], "day": tweet_array[i].time, "distance": tweet_array[i].distance})
		}

		else if (val == activities[1]){
			act_counter.push({"activity": activities[1], "day": tweet_array[i].time, "distance": tweet_array[i].distance})
		}

		else if (val == activities[2]){
			act_counter.push({"activity": activities[2], "day": tweet_array[i].time, "distance": tweet_array[i].distance})
		}

	}

	return act_counter;
}




function weekday_vs_weekend(weekdays, weekend){
	var total_weekday_activites = activity_stats(weekdays);

	var total_weekday_dis = total_distance(weekdays);

	var longest_weekday = longest_distance_week(total_weekday_activites, total_weekday_dis);


	var total_weekend_activites = activity_stats(weekend);

	var total_weekend_dis = total_distance(weekend);

	var longest_weekend = longest_distance_week(total_weekend_activites, total_weekend_dis);

	if (longest_weekday > longest_weekend){
		return "weekdays";
	}

	return "weekends";
}

function weekday(tweet_array){
	var new_tweet_array = [];

	for (let i = 0; i < tweet_array.length; i++){
		if (tweet_array[i].time.getDay() != 6 && tweet_array[i].time.getDay() != 0){
			new_tweet_array.push(tweet_array[i]);
		}
	}

	return new_tweet_array;
}

function weekend(tweet_array){
	var new_tweet_array = [];

	for (let i = 0; i < tweet_array.length; i++){
		if (tweet_array[i].time.getDay() == 6 || tweet_array[i].time.getDay() == 0){
			new_tweet_array.push(tweet_array[i]);
		}
	}

	return new_tweet_array;
}


function total_distance(tweet_array){
	var counter = {};

	for (let i = 0; i < tweet_array.length; i++){
		let val = tweet_array[i].activityType;
		if (!(val in counter) && val != "" && val != "unknown"){
			counter[val] = tweet_array[i].distance;
		}

		else if (val in counter) {
			counter[val] += tweet_array[i].distance;
		}
	}

	return counter;
}

function filter_popular(total_act){
	let sorted = Object.fromEntries(Object.entries(total_act).sort((a, b) => b[1] - a[1]).slice(0, 3));
	return sorted;

}

function shortest_distance(total_act, total_dis){
	let lowest = Infinity;
	let shortest_dis = "";
	for ([key, val] of Object.entries(total_act)){
		let average = total_dis[key] / val;
		if (average < lowest && average != 0) {
			lowest = average;
			shortest_dis = key;
		}
	}
	return shortest_dis;
}

function longest_distance(total_act, total_dis){
	let highest = 0;
	let longest_dis = "";
	for ([key, val] of Object.entries(total_act)){
		let average = total_dis[key] / val;
		if (average > highest) {
			highest = average;
			longest_dis = key;
		}
	}
	return longest_dis;
}

function longest_distance_week(total_act, total_dis){
	let total_distance = 0;
	let total_activities = 0;
	for ([key, val] of Object.entries(total_act)){
		total_distance += total_dis[key];
		total_activities += val;
	}
	let average = total_distance / total_activities;
	return average;
}

function activity_stats(tweet_array){
	var counter = {};
	for (let i = 0; i < tweet_array.length; i++){
		let val = tweet_array[i].activityType;
		if (!(val in counter) && val != "" && val != "unknown"){
			counter[val] = 1;
		}
		else if (val in counter) {
			counter[val] += 1;
		}
	}

	return counter;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});