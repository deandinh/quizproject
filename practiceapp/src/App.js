import React, {useState, useRef}from 'react';
import "./style.css";
import ireland from "./ireland.svg"
import Countdown from "react-countdown";







function App(){
  const [counties] = useState(["antrim", "armagh","carlow","cavan","clare","cork","donegal","down","dublin","fermanagh"
  ,"galway","kerry","kildare","kilkenny","laois","leitrim","limerick","derry","longford","louth","mayo","meath","monaghan"
  ,"offaly","roscommon","sligo","tipperary","tyrone","waterford","westmeath","wexford","wicklow"]);
  const [guessed, setGuessed] = useState([]);
  const [sortType, setSortType] = useState("alphabetically")
  const [displayMap, setDisplayMap] = useState(false)
  const [inGame, setInGame] = useState(true)
  const [start, setStartGame] = useState(false)
  const[timer, setTimer] = useState(true)


  const renderer = ({minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    return <span>{minutes}:{seconds}</span>;
  }
};

const clockRef = useRef();
const handleStart = () => clockRef.current.start();
const handlePause = () => clockRef.current.pause();

function handleButton()
{
  if(timer){
    handlePause();
  }else{
    handleStart();
  }
  setTimer(!timer);
}




  function toTitles(s)
    { return s.replace(/\w\S*/g, function(t) 
        { return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase(); 
          }
      ); 
    }

    function sorting(countA, countB)
    {
      if(sortType==="alphabetically")
      {
        let comparison = 0;

        if(countA>countB)
        {
          comparison = 1;
        }
        else if(countA<countB)
        {
          comparison = -1;
        }
        else{
          comparison=0;
        }
        return comparison;
      }
      else if(sortType==="alphabeticallyno"){
        let comparison = 0;

        if(countA>countB)
        {
          comparison = -1;
        }
        else if(countA<countB)
        {
          comparison = 1;
        }
        else{
          comparison=0;
        }
        return comparison;
      }
      else{
        return null;
      }


    }

    const startDate = React.useRef(Date.now());
  
  return(


    <div class="App">
      <div class="text-center h1">

        {!start && (
          <StartTheGame setStartGame={setStartGame}
          start={start}/>
        )}




{inGame && start && (
    <Countdown date={startDate.current + 600000}
      renderer={renderer}
      onComplete={()=> setInGame(false)}
      ref={clockRef}/>
)}
<br/>
{inGame && start && timer && ( 
<button class="btn btn-outline-dark" onClick={()=>handleButton()}>Pause Timer</button>)}
{inGame && start && !timer && ( 
<button class="btn btn-outline-dark" onClick={()=>handleButton()}>Resume Timer</button>)}


    </div>
      <div class="container">
        <br/><br/>
        {displayMap && (
        <img src={ireland} class="ireland d-md-block col-md d-none"/>
  )}
      {guessed.length===32 && inGame && start &&(
        <Winner
        setGuessed={setGuessed}
        setDisplayMap={setDisplayMap}/>
      )}
        {guessed.length<32 && inGame && start &&(<GuessCounty 
  guessed={guessed}
  setGuessed={setGuessed}
  counties={counties}
  sortType={sortType}
  setSortType={setSortType}
  setDisplayMap={setDisplayMap}
  displayMap={displayMap}
  />)}
  {!inGame && start && (
    <Completionist/>
  )}


{inGame && start && (<h3 class="text-center"><strong>Counties of Ireland:</strong></h3>)}

      <hr/>
<div class="container d-flex m-auto cont">
  <div class="box container">
  <ul class="list">
    
     
    
    <div class="list">
      {guessed.sort(sorting).map((a)=>(
        <div key={a} class="list">
          <li><strong>{toTitles(a)}</strong></li>
        </div>
      ))}
    </div>
  </ul>
</div>
</div>
</div>

  </div>
  );
}







function Completionist(){
  return(
    <div class="complete">
  <h1 class="text-center">Time Out!</h1>
  <button class="btn btn-outline-dark reset d-flex"onClick={()=> window.location.reload(false)}>Retry!</button>
  </div>
  );
}

function StartTheGame(props){
  return(
    
  <div class="container startbtn">
    <div class="h1 title">Irish Counties Quiz</div>
    <button class="btn btn-outline-dark btn-lg" onClick={()=>props.setStartGame(true)}>Start Quiz</button>
  </div>
  );
}


function GuessCounty(props){
  const [county, setCounty] = useState("");
  const [alreadyGuessed, setAlreadyGuessed] = useState("");
  const checkArray = () =>{

    if((props.guessed.indexOf(county)<0) && (props.counties.indexOf(county)>-1))
    {
      props.setGuessed(props.guessed.concat(county));
      setAlreadyGuessed("");
      setCounty("");
    }
    else if(props.guessed.indexOf(county)>-1)
    {
      setAlreadyGuessed("Already guessed this county!");
    }
  }

  return(
    <div class="text-center m-auto">
  <h3> <strong>Number of counties guessed: </strong>{props.guessed.length}</h3>

        <input
          type="text" 
          placeholder="Enter a county"
          value={county}
          onChange={(e) => setCounty(e.target.value.toLowerCase())}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              checkArray()
            }
          }}
          class="lg"
        />
        <h5>{alreadyGuessed}</h5>
        <button onClick={()=> props.setDisplayMap(!props.displayMap)} class="btn btn-outline-dark m-auto d-none d-md-block">Toggle Map</button>
        <div class="dropdown m-1">
        
  <button class="btn btn-outline-dark dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    Sort By
  </button>
  <ol class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <li><button class="dropdown-item" href="#" onClick={()=> props.setSortType("alphabetically")}>A-Z</button></li>
    <li><button class="dropdown-item" href="#" onClick={()=> props.setSortType("alphabeticallyno")}>Z-A</button></li>
  </ol>
  
</div>

    </div>
  );
}

function Winner(props){
  props.setDisplayMap(false);
  return(
    <div>
      <h1 class="m-auto text-center">Congratulations!<br/> You named all 32 counties!</h1>
      <br/>
      <button class="btn btn-outline-dark m-auto d-flex p-2" onClick={()=> props.setGuessed([])}>Restart</button>
      <hr/>
    </div>
  )
}
export default App;
