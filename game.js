const question = document.getElementById("question");
const choices = Array.from( document.getElementsByClassName("choice-text"));
const progress = document.getElementById('progress');
const scoretText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
let currentQ = {};
let acceptingAns= false;
let score= 0;
let questionCounter= 0;
let availQuestions= [];

let questions = [];

fetch("questions.json").then(res =>{
    
    return res.json();

}).then (loadedQs =>{
    console.log(loadedQs);
    questions= loadedQs;
    startGame();
})
.catch(err => {
    console.log(err);
});
    

const CORRECT_BONUS= 10;
const MAX_QUESTIONS=3;
   
startGame =() =>{
    questionCounter=0;
    score=0;
    availQuestions=[...questions];
    
    getNewQs();


};
getNewQs = ()=>{
    if (availQuestions.length == 0 ||questionCounter >= MAX_QUESTIONS ){
        
        
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign("/end.html");
    }
    questionCounter++;
    progress.innerText= "Question" +questionCounter+ "/" +MAX_QUESTIONS ;

    const questionIndex = Math.floor(Math.random()* availQuestions.length);
    currentQ= availQuestions[questionIndex];
    question.innerText= currentQ.question;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText= currentQ["choice"+ number];
    });
    availQuestions.splice(questionIndex,1);
    acceptingAns=true;
};

    choices.forEach( choice=>{
        choice.addEventListener('click', e=> {
        
        if(!acceptingAns) return;

        acceptingAns= false;
        const selectedchoice= e.target;
        const selectedAns= selectedchoice.dataset ["number"];
        const classToApply = selectedAns == currentQ.answer ? 'correct' : 'incorrect';
        if (classToApply == 'correct'){
            incrementScore(CORRECT_BONUS);
        };
        selectedchoice.parentElement.classList.add(classToApply);
        
        setTimeout( () => {
        selectedchoice.parentElement.classList.remove(classToApply);
        getNewQs();
        }, 1000);
        
    });
});

incrementScore= num =>{
    score +=num;
    scoretText.innerText=score;
}


