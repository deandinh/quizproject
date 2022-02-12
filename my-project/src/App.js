import React, { Component } from "react";
import "./style.css";
import image from "./images/wikipedia.png"
import image2 from "./images/hero.jpg"
import image3 from "./images/NUIM.jpg"

class App extends Component{
    constructor(props){
        super(props);
        this.state={
            //Create a local array variable for each Json file to get from API
            apiData:[],
            apiData1:[],
            apiData2:[],
            apiData3:[],
            apiData4:[],
            apiData5:[],
            isFetched:false,
            errorMsg:null,
            showAns:false,
            //qNum is an iterator used to keep track of what question we are currently on
            qNum:0,
            //options is an array holding each answer option we can use.
            options:[],
            inGame: false,
            lost:false,
            score:0,
            lifelines:["50/50", "Call A Friend", "Change The Question"],
            fifty:false,
            callAfriend:"",
            listOfFriends:["Liam", "Louis", "Lyka", "Ema", "Maria", "Sinead", "Clint"],
            //We create an array of questions which have already been asked, so the same question won't be asked twice
            qlist:[],
            topicChoice:null,
            topics:["General Knowledge", "Science and Nature", "Animals", "Television", "Computers"]
        };
        this.changeQ = this.changeQ.bind(this);
        this.goInGame = this.goInGame.bind(this);
        this.checkAns = this.checkAns.bind(this);
        this.backToMenu = this.backToMenu.bind(this);
        this.lifelineUse = this.lifelineUse.bind(this);
        this.formatText = this.formatText.bind(this);
        this.shuffleArray = this.shuffleArray.bind(this);
        this.handleListChange = this.handleListChange.bind(this);
        this.restart = this.restart.bind(this);
    }
    
    async componentDidMount(){
        try{
            //fetch each API from quiz database, each API corresponds to a topic
            const API_URL = "https://opentdb.com/api.php?amount=50&category=9&type=multiple";
            const response = await fetch(API_URL);
            const jsonResult = await response.json();
            this.setState({ apiData1: jsonResult});

            const API_URL2 = "https://opentdb.com/api.php?amount=50&category=17&type=multiple";
            const response2 = await fetch(API_URL2);
            const jsonResult2 = await response2.json();
            this.setState({ apiData2: jsonResult2});

            const API_URL3 = "https://opentdb.com/api.php?amount=50&category=27&type=multiple";
            const response3 = await fetch(API_URL3);
            const jsonResult3 = await response3.json();
            this.setState({ apiData3: jsonResult3});

            const API_URL4 = "https://opentdb.com/api.php?amount=50&category=14&type=multiple";
            const response4 = await fetch(API_URL4);
            const jsonResult4 = await response4.json();
            this.setState({ apiData4: jsonResult4});

            const API_URL5 = "https://opentdb.com/api.php?amount=50&category=18&type=multiple";
            const response5 = await fetch(API_URL5);
            const jsonResult5 = await response5.json();
            this.setState({ apiData5: jsonResult5});

            this.setState({isFetched:true});
        }catch(error){
            this.setState({isFetched:false});
            this.setState({errorMsg:error});
        }
    }
    handleListChange(event) {
        //Handles the change of topic choice
        this.setState({ topicChoice: event.target.value });
      }

    formatText(str){
        //Controls the HTML encoding
        str = str.replaceAll('&quot;', '"');
        str = str.replaceAll('&aring;', 'å'); 
        str = str.replaceAll("&#039;", "'");
        str = str.replaceAll("&lsquo;", "'");
        str = str.replaceAll("&rsquo;", "'");
        str = str.replaceAll("&ldquo;", '"');
        str = str.replaceAll("&rdquo;", '"');
        str = str.replaceAll("&iacute;", 'í');
        str = str.replaceAll("&amp;", '&');
        str = str.replaceAll("&Eacute;", 'É');
        str = str.replaceAll("&ouml;", 'ö');
        str = str.replaceAll("&hellip;", '...');
        str = str.replaceAll("&oacute;", 'ó');
        str = str.replaceAll("&lrm;", '');
        str = str.replaceAll("&auml;", "ä");
        str = str.replaceAll("&shy;", "");
        str = str.replaceAll("&aacute;", "á");
        str = str.replaceAll("&eacute;", "é");

        return str;
    }
    //a function to change the question
    changeQ(){

        this.setState({qNum:this.state.qNum+2});
        this.setState({score: this.state.score+1})
        if(!this.state.lifelines.includes("50/50"))
        {
            this.setState({fifty:true});
        }
        if(!this.state.lifelines.includes("Call A Friend"))
        {
            this.setState({callAfriend:""});
        }
    }
    //a function to handle all lifeline uses
    lifelineUse(a, b, c){
        let filteredArray = this.state.lifelines.filter(item => item !== a)
        this.setState({lifelines: filteredArray});

        if(a==="Call A Friend"){
            //the call a friend function gives a chance for the answer to be wrong, with the "odds" varaible
            let ans = ""
            let odds = Math.floor(Math.random() *100);
            let friend = Math.floor(Math.random() *this.state.listOfFriends.length);
            if(odds>=10){  
                ans = b;
                this.setState({callAfriend: "Your friend " +this.state.listOfFriends[friend] + " thinks the answer is " + ans})
            }
            else if(odds>=5){
                ans = c;
                this.setState({callAfriend: "Your friend " +this.state.listOfFriends[friend] + " thinks the answer is " + ans})
            }
            else{
            this.setState({callAfriend: "Your friend " +this.state.listOfFriends[friend] + " didn't pick up!"})
            }
        }
        if(a==="Change The Question")
        {
            this.changeQ();
            this.setState({score: this.state.score});
        }
    }
    
    goInGame(){
        let jsonCopy = this.state.apiData1;


        //we select and shuffle the array of questions depending on what topic was chosen
        switch(this.state.topicChoice){
            case "0": 
                jsonCopy = this.state.apiData1;
                this.shuffleArray(jsonCopy.results);
                break;
            case "1":
                jsonCopy = this.state.apiData2;
                this.shuffleArray(jsonCopy.results);
                break;
            case "2":
                jsonCopy = this.state.apiData3;
                this.shuffleArray(jsonCopy.results);
                break;
            case "3":
                jsonCopy = this.state.apiData4;
                this.shuffleArray(jsonCopy.results);
                break;
            case "4":
                jsonCopy = this.state.apiData5;
                this.shuffleArray(jsonCopy.results);
                break;
            default:
                jsonCopy = this.state.apiData1;
                this.shuffleArray(jsonCopy.results);
        }

        this.setState({inGame: true,qList:[], qNum:0, apiData:jsonCopy});
    }
    //Check if the answer chosen is the correct answer
    checkAns(choice, rightAns){
        if(choice!==rightAns)
        {
            this.setState({lost:true});
        }
        else if(this.state.score!==15)
        {
            this.changeQ();
        }
        else{
            this.setState({inGame:false, lost:false, qList:[], qNum:0, score:15});
        }
    }
    //a function to go back to the main menu, resetting all state variables to default values
    backToMenu(){
        this.setState({inGame:false, lost:false, qList:[], qNum:0, score:0, lifelines:["50/50", "Call A Friend", "Change The Question"], callAfriend:"", fifty:false, topicChoice:this.state.topicChoice});
    }
    //a function to go straight back into the game at question 1, of the topic already chosen
    restart(){
        this.setState({inGame:false, lost:false, qList:[], qNum:0, score:0, lifelines:["50/50", "Call A Friend", "Change The Question"], callAfriend:"", fifty:false, topicChoice:this.state.topicChoice});
        this.goInGame();
    }
    //a function to shuffle an array, used for the questions in the JSON file, so we don't get the same questions over and over again
    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    render(){
        //if we hit a score of 15, we win the game
        if(this.state.score===15)
        {
            return(
                
                <Winner
                backToMenu={this.backToMenu}/>
            );
        }
        if(this.state.errorMsg)
        {
            return(
                <ErrorComponent/>
            );
        } else if(this.state.isFetched === false)
        {
            return(
                <LoadingComponent/>
            );
        }
        //if we're in the game and we haven't lost, load the game
        else if(this.state.inGame && !this.state.lost){
            return(
                
            <GameComponent
            apiData={this.state.apiData}
            qNum={this.state.qNum}
            changeQ={this.changeQ}
            checkAns={this.checkAns}
            score={this.state.score}
            lifelines={this.state.lifelines}
            lifelineUse={this.lifelineUse}
            options={this.state.options}
            formatText = {this.formatText}
            fifty = {this.state.fifty}
            callAfriend={this.state.callAfriend}
            backToMenu={this.backToMenu}
            shuffleArray={this.shuffleArray}
            />
            );
            
        }
        else if(!this.state.inGame){
            return(
            <MainMenu
            goInGame={this.goInGame}
            handleListChange={this.handleListChange}
            topics={this.state.topics}
            />
            );
        }
        else if(this.state.lost){
            return(
                <LostScreen
                backToMenu={this.backToMenu}
                apiData={this.state.apiData}
                qNum={this.state.qNum}
                formatText={this.formatText}
                score={this.state.score}
                restart={this.restart}
                />
            );
        }

    }
}

class GameComponent extends Component{

    //if we click on a lifeline, call the lifeline function
    lifelineClick(a){
        this.props.lifelineUse(a);
    }

    render(){
        let apiData = this.props.apiData;
        let qNum = this.props.qNum;
        let score = this.props.score;
        let checkAns = this.props.checkAns;
        let options = this.props.options;
        let formatText = this.props.formatText;
        let prize="";
        let lifelines = this.props.lifelines;
        let fifty = this.props.fifty;
        let lifelineUse = this.props.lifelineUse;
        let callAfriend = this.props.callAfriend;
        let wrongChoice="";
        let backToMenu = this.props.backToMenu;
        let shuffleArray = this.props.shuffleArray;
        //if 50/50 is an available lifeline, or we have already used it previously, load 4 answer options
        if(lifelines.includes("50/50") || fifty)
        {
        options = [formatText(apiData.results[qNum].correct_answer),
        formatText(apiData.results[qNum].incorrect_answers[0]),
        formatText(apiData.results[qNum].incorrect_answers[1]),
        formatText(apiData.results[qNum].incorrect_answers[2])];
        }// else load only 2 options, as 50/50 must have been used on this question
        else{
            options = [formatText(apiData.results[qNum].correct_answer),
            formatText(apiData.results[qNum].incorrect_answers[0])];
        }
        if(options[0]===formatText(apiData.results[qNum].correct_answer))
        {
            wrongChoice=options[1];
        }
        else{
            wrongChoice=options[0];
        }
        //use a switch statement to get the corresponding prize for the question we are on
        switch(score){
            case 0: 
                prize="€100"; 
                break;
            case 1:
                prize="€200";
                break;
            case 2:
                prize="€300";
                break;
            case 3:
                prize="€500";
                break;
            case 4:
                prize="€1,000";
                break;
            case 5:
                prize="€2,000";
                break;
            case 6:
                prize="€4,000";
                break;
            case 7:
                prize="€8,000";
                break;
            case 8:
                prize="€16,000";
                break;
            case 9:
                prize="€32,000";
                break;
            case 10:
                prize="€64,000";
                break;
            case 11:
                prize="€125,000";
                break
            case 12:
                prize="€250,000";
                break;
            case 13:
                prize="€500,000";
                break;
            case 14:
                prize="€1,000,000";
                break;
            default:
                prize="€0";
        }

shuffleArray(options);
        
        return(
            
            <div className = "inGame">

                <button type="button" class="btn btn-outline-dark btn-lg backButton" onClick={()=>backToMenu()}> Back to Main Menu</button>
            <h1 class="headTitle">Who wants to be a Maynooth Millionare Q{score+1}</h1>
   

            <hr/>
            <br/>
            <div className="inGame2">
            <h2>For {prize}!</h2>
            <h4>Question: </h4>
            <h1>{formatText(apiData.results[qNum].question)}</h1>
            <br/>
            <div class="questions">
            {options.map((a =>(
            <button type="button" class="btn btn-outline-primary btn-lg" onClick={()=>checkAns(a, formatText(apiData.results[qNum].correct_answer))}>{a}</button>
            )))}
            </div>
            <hr/>
            <h4>Lifelines: </h4>
            {lifelines.map((a => (
                
                    <div class="btn-group btn-group-lg" role="group" aria-label="Basic example">
  
                    <button type="button" class="btn btn-outline-dark btn-lg" onClick={()=> lifelineUse(a, formatText(apiData.results[qNum].correct_answer),
                    wrongChoice)}>{a}</button></div>
            )))}
            </div>

            <h4 class="call">{callAfriend}</h4>
            </div>
        );
    }
}

class MainMenu extends Component{
    //the mainmenu gives us a dropdown list to choose our topic.
    //we can also click on links to take us to various pages
    

    render(){
        let goInGame = this.props.goInGame;
        let handleListChange = this.props.handleListChange;
        let topics = this.props.topics;


        return(
            <div className="MainMenu">
            <div class="container">
            <h1 class="myHeader">Who wants to be a Maynooth Millionare?</h1>
            <hr/>

        <form>
          <select class="form-select" aria-label="Default select example" onChange={handleListChange}>
          <option value="" disabled selected>Select Topic</option>
            {topics.map((topic, key) => (
              <option key={key} value={key}>
                {topic}
              </option>
            ))}
          </select>
        </form>
        <br/>

            <button type="button" class="btn btn-outline-dark btn-lg startButton" onClick={()=> goInGame()}>Start Game</button>
            </div>
            <div className="picRow">
            <a href="https://en.wikipedia.org/wiki/Who_Wants_to_Be_a_Millionaire%3F_(British_game_show)" class="but">
             <img src={image} class="pic"/>
            </a>
            <a href="https://www.maynoothuniversity.ie/" class="but">
             <img src={image3} class="pic"/>
            </a>
            <a href="https://www.youtube.com/watch?v=_Yufu6WNMEM&ab_channel=ITV" class="but">
             <img src={image2} class="pic"/>
            </a>
            
            </div>

            </div>
            );
    }
}

class LoadingComponent extends Component{
    render(){
        return(
            <div className="Loading">
                Loading...
            </div>

        );
    }
}

class ErrorComponent extends Component{
    render(){
        return(
            <div className="Error">
                An error has occured
            </div>
        );
    }
}

class LostScreen extends Component{
    //the lost screen componant renders when we get a question wrong.
    //we get the choice of going back to the mainmenu, or to restart the game
    render(){
        let backToMenu = this.props.backToMenu;
        let apiData = this.props.apiData;
        let qNum = this.props.qNum;
        let formatText = this.props.formatText;
        let score = this.props.score;
        let restart = this.props.restart;

        return(
            <div className="LostScreen">
                <h1>You Lost!</h1>
                <h2>The correct answer was: {formatText(apiData.results[qNum].correct_answer)}!</h2>
                <h4>You made it to question {score+1}!</h4>
                <br/>
                <button type="button" class="btn btn-outline-dark btn-lg startButton" onClick={()=> restart()}>Restart</button>
                <br/>
                <br/>
                <button type="button" class="btn btn-outline-dark btn-lg" onClick={()=> backToMenu()}>Return to Main Menu</button>
            </div>
        );
    }
}

  

class Winner extends Component{
    //the winner componant renders when we successfully answer question 15.
    //we then get the option to go back to the menu
    render(){
        let backToMenu = this.props.backToMenu;
        return(
            <div className="Winner">
                <h1>Congratulations! You've won €1,000,000!</h1>                
                <button type="button" class="btn btn-outline-dark btn-lg" onClick={()=> backToMenu()}>Finish!</button>
            </div>
        );
    }
}



export default App;
