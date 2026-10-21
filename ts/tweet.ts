class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.includes("Just completed") || this.text.includes("Just posted")) {
            return 'completed_event';
        }

        else if (this.text.includes("Watch")){
            return 'live_event';
        }

        else if (this.text.includes("Achieved")){
            return 'achievement';
        }


        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (this.text.includes(" - ")) {
            return true;
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        var written = this.text;

        var cleaning_written = written.split(" ").slice(0, -2).join(' ');

        let begin = cleaning_written.indexOf('-');
        var clean_written = cleaning_written.slice(begin+1);


        
        return clean_written.trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        //TODO: parse the activity type from the text of the tweet
        let split_text = this.text.split(' ');

        let index_dis = 4;
        // let index_mi = split_text.indexOf("mi");

        let index_dash = split_text.indexOf('-');
        let index_with = split_text.indexOf('with');

        if (split_text[4] == 'km'){
            if (index_dash != -1){
                 return split_text.slice(index_dis+1, index_dash).join(' ');
            }

            else if (index_with != -1){
                    return split_text.slice(index_dis+1, index_with).join(' ');
            }
            

        }

        else if (split_text[4] == 'mi'){
            if (index_dash != -1){
                 return split_text.slice(index_dis+1, index_dash).join(' ');
            }

            else if (index_with != -1){
                return split_text.slice(index_dis+1, index_with).join(' ')
            }
        }

        else {
            if (split_text.includes("in")){
                return split_text.slice(3, split_text.indexOf('in')).join(' ');
            }
            else {
                return "unknown";
            }
        }
        
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        let split_text = this.text.split(' ');
        let num: number = Number(split_text[3]);

        if (isNaN(num) == false){
            if (split_text[4] == 'km'){
                return num / 1.609;
            }

            else if (split_text[4] == 'mi'){
                return num;
            }
        }

        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}