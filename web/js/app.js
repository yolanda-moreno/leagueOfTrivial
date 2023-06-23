var tmp = null;
Vue.component('barra-nav', {
    async mounted() {
        // Returns an object with the user info in case it refreshes the page (it keeps its session),
        // if the object is empty, it means that user will have to log in.
        await fetch(`../leagueOfTrivialG2/api/api/check-user`)
            .then(response => response.json())
            .then(data => {
                if (data.userName) {
                    store = userStore();
                    store.setEstado(data);
                    store.logged = true;
                }
            });
    },
    template: `<div class="header1">
                        <div class="header1_div1">
                            <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
                                <template #button-content>
                                    <span class="header1_div1-element sr-only"><img src="../img/logo-sm.png" width="80px"></span>
                                </template>
                                <b-dropdown-item @click="goHome">Home</b-dropdown-item>
                                <b-dropdown-item>
                                    <router-link to="/ranking" class="dropdown-item_routerLink">
                                        Global Ranking
                                    </router-link>
                                </b-dropdown-item>
                            </b-dropdown>                  
                        </div>
                        <div v-show="!isLogged" class="header1_div2" v-b-modal.login>
                            <router-link to="/login" class="header1_div2-element">
                                <span>Login</span>
                            </router-link>
                            <router-view></router-view>              
                        </div>
                        <div v-show="isLogged" class="header1_div2">
                            <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret style="background-color:white">
                                <template #button-content>
                                    <span style="font-size:20px;">{{userName}}&nbsp;</span>
                                    <b-avatar variant="info" :src="avatar"></b-avatar>
                                </template>
                                <b-dropdown-item href="#" @click="goToProfile" class="dropdown-item_routerLink">Profile</b-dropdown-item>
                                <b-dropdown-item href="#" @click="logOut" style="text-decoration: none;">Logout</b-dropdown-item>
                            </b-dropdown>
                        </div> 
                </div>`,
    computed: {
        isLogged() {
            return userStore().logged;
        },
        avatar() {
            return userStore().loginInfo.imageUrl;
        },
        userName() {
            return userStore().loginInfo.userName;
        },
        idUser() {
            return userStore().loginInfo.id;
        }
    },
    methods: {
        logOut: function () {
            // Logs the user out
            store.logged = false;
            store.loginInfo = {};
            fetch("../leagueOfTrivialG2/public/api/logout", {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            if (this.$router.history.current.path != '/') {
                this.$router.push({ path: '/' })
            }
        },
        goToProfile: function () {
            // It reloads the page so that when you are in seeing a user profile and want to see yours (by clicking in the navbar shortcut), data can be updated
            this.$router.push({ path: '/profile/' + userStore().loginInfo.id }).then(window.location.reload());
        },
        goHome: function () {
            // Goes back home
            this.$router.push({ path: '/' })

        }
    }
})
Vue.component('foter', {
    template: `<div>
            <footer>
                <div class="footer-copyright">
                    <p>League Of Trivial @2022 made by: Mario Benavente, Sergi Cantero and Yolanda Moreno.</p><br>
                    <p>All questions and categories are the work of the creators of <em>The Trivia Api</em>. For any question about the rights click <a class="link-license" href="https://the-trivia-api.com/license/">here</a>.</p>
                </div>
            </footer>
    </div>`
})
const home = Vue.component('portada', {
    data: function () {
        return {
            penalized: false
        }
    },
    template: `<div>
                <barra-nav></barra-nav>
                <b-alert v-model="penalized" variant="danger" show dismissible fade>
                    You have been penalized for leaving a game. <br> You have lost 250 <span><img src="../img/rupia.png" width="10px"></span>...<br>
                    Think twice next time.
                </b-alert>
                <div class="textoCentrado">
                    <img class="titulo" src="../img/fina.gif">
                </div>
                <div class="portada-principal" v-show="isLogged">
                    <div class="centerItems_portada">
                        <router-link class="linkButton_normal linkButton" to="/game/0">Random Quiz</router-link>
                        <br>
                        <router-link v-if="!dailyIsPlayed" class="linkButton_daily linkButton" to="/game/1">Daily Quiz</router-link>
                        <div v-if="dailyIsPlayed" class="linkButton_daily--disabled linkButton">Daily Quiz</div>
                        <p v-if="dailyIsPlayed" class="alert-message-daily">Only once per day!</p>
                    </div>
                </div>
                <div class="portada-demo" v-show="!isLogged">
                    <div class="centerItems">
                        <router-link class="linkButton_demo linkButton" to="/game/2">Play Demo</router-link>
                    </div>
                </div>
                
                <foter></foter>
            </div>`,
    computed: {
        isLogged() {
            return userStore().logged;
        },
        dailyIsPlayed() {
            return userStore().loginInfo.dailyPlayed;
        }
    },
    mounted() {
        setTimeout(() => {
            // If you are logged in and have a pending game, you will be penalized (-250 points)
            if (userStore().logged && userStore().loginInfo.inGame != 0) {
                const params = {
                    idUser: userStore().loginInfo.id
                }
                fetch("../leagueOfTrivialG2/public/api/penalize", {
                    method: 'POST',
                    body: JSON.stringify(params),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                this.penalized = true;
            }
        }, 1000);
    }
})
const ranking = Vue.component('ranking', {
    data: function () {
        return {
            ranking: [],
            daily: false,
            global: false,
            infoChallenge: [],
            userData: []
        }
    },
    mounted() {
        // Gets the info of the ranking where the game type is "normal"
        fetch(`../leagueOfTrivialG2/public/api/get-rankings`)
            .then(response => response.json())
            .then(data => {
                this.ranking = data;
            });
    },
    methods: {
        dailyRank: function () {
            // Gets the info of the ranking where the game type is "daily"
            fetch(`../leagueOfTrivialG2/public/api/get-dailyRankings`)
                .then(response => response.json())
                .then(data => {
                    this.ranking = data;
                    this.daily = true;
                    this.global = false
                });
        },
        globalRank: function () {
            // Does the same as mounted function, in case you want to check it again
            fetch(`../leagueOfTrivialG2/public/api/get-rankings`)
                .then(response => response.json())
                .then(data => {
                    this.ranking = data;
                    this.global = true;
                    this.daily = false;
                });
        },
        userProfile: function (id) {
            //Gets the user information and redirects to its profile page
            this.idUser = this.ranking[id].idUser;
            this.$router.push({ name: 'profile', params: { idUser: this.idUser } })
        }
    },
    template: `<div>
                <barra-nav></barra-nav>
                    <div id="ranking-marco">
                        <div id="ranking-diffSelect">
                            <div class="diff1"><a @click="globalRank">Global</a></div>
                            <div class="diff2"><a @click="dailyRank">Daily</a></div>
                        </div>
                        <div id="ranking-fondo">
                            <table id="ranking-table">
                                <tr class="ranking-cell ranking-titulo">
                                    <th class="colNum">#</th>
                                    <th class="colName">USER</th>
                                    <th class="colScore">SCORE</th>
                                </tr>
                                    <tr class="ranking-cell" v-for="(score,index) in ranking" :class="classObject(index)">
                                        <td v-if="index==0 || index==1 || index==2">
                                            <span v-if="index==0"><img src="../img/medal0.png" class="medal"></span>
                                            <span v-if="index==1"><img src="../img/medal1.png" class="medal"></span>
                                            <span v-if="index==2"><img src="../img/medal2.png" class="medal"></span>
                                        </td>
                                        <td v-else>{{index+1}}</td>
                                        <td v-show="isLogged"><router-link :to="{path: '/profile/' + score.idUser}">{{score.userName}}</router-link></td>
                                        <td v-show="!isLogged">{{score.userName}}</td>
                                        <td>{{score.score}}</td>
                                    </tr>
                            </table>
                        </div>
                    </div>
                    <foter></foter>
                </div>`,
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userLogged() {
            return userStore().loginInfo.idUser;
        },
        classObject() {
            // If the user of the ranking is myself, then it applies the "myself" class to see an emphasis
            return user => {
                return [
                    this.ranking[user].idUser == userStore().loginInfo.id ? 'myself' : 'notMyself'
                ]
            }
        }
    }
})
const challenge = Vue.component('challenge', {
    data: function () {
        return {
            questions: [],
            gameType: [],
            ready: false,
            info: []
        }
    },
    props: ['infoChallenge'],
    mounted() {
        params = {
            idGame: this.infoChallenge.idGame
        }
        // Gets the information of the game that is going to be played in the challenge (unifies all 4 answers and shuffles them)
        fetch("../leagueOfTrivialG2/public/api/get-challenge", {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => response.json())
            .then(data => {
                this.questions = JSON.parse(data);
                for (let index = 0; index < this.questions.length; index++) {
                    this.questions[index].done = false;
                    this.questions[index].answers = [];
                    this.questions[index].answers.push({ "text": this.questions[index].correctAnswer, "estat": true });
                    this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[0], "estat": false });
                    this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[1], "estat": false });
                    this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[2], "estat": false });
                    this.questions[index].answers = this.questions[index].answers.sort((a, b) => 0.5 - Math.random());
                }
                this.gameType.difficulty = this.infoChallenge.difficulty;
                this.gameType.category = this.infoChallenge.category;
                this.gameType.type = "challenge";
                switch (this.gameType.difficulty) {
                    case "Easy":
                        this.gameType.difficulty = "easy";
                        break;
                    case "Medium":
                        this.gameType.difficulty = "medium";
                        break;
                    case "Hard":
                        this.gameType.difficulty = "hard";
                        break;
                }
            })
    },
    template: `<div>
                <barra-nav></barra-nav>
                    <div v-show="!ready">
                        <div class="centerChallenge">
                            <div class="challenge__title">You are about to get into a challenge</div>
                            <div class="challenge">
                                <div class="challenge__challenger">
                                    <div class="perfilAvatar"
                                        :style="{backgroundImage: 'url('+this.infoChallenge.challengersImage+')'}"></div>
                                    {{this.infoChallenge.challengersName}} <br>
                                    no points yet
                                </div>
                                VS
                                <div class="challenge__challenged">
                                    <div class="perfilAvatar"
                                        :style="{backgroundImage: 'url('+this.infoChallenge.challengedsImage+')'}"></div>
                                    {{this.infoChallenge.challengedsName}} <br>
                                    {{this.infoChallenge.challengedsScore}} points
                                </div>
                            </div>
                            <div class="challenge__title">Are you sure about that?</div>
                            <div class="buttons-container">
                                <button class="linkButton--small linkButton_goBack">
                                    <router-link :to="{path: '/profile/' + this.infoChallenge.idChallenged}">Nevermind</router-link>
                                </button>
                                <button @click="ready=true" class="linkButton--small linkButton_startChallenge">Let's go</button>
                            </div>
                        </div>
                    </div>
                    <div v-show="ready">
                        <quiz :quiz="questions" :gameConfig="gameType" :challengeInfo="infoChallenge"></quiz>
                    </div>
                </div>`
})
const lobby = Vue.component('quiz-lobby', {
    mounted() {
        // Makes an array with the categories provided by the-trivia-api
        fetch(`https://the-trivia-api.com/api/categories`)
            .then((response) => response.json())
            .then((data) => {
                this.categories.key = Object.keys(data);
                this.categories.value = Object.values(data);
                this.categories.value[0].splice(0, 2);
                this.categories.value[1].splice(0, 2);
                this.categories.value[2].splice(this.categories.value[2].length - 2, 2);
                this.categories.value[8].splice(this.categories.value[8].length - 2, 2);
                this.categories.value[9].splice(this.categories.value[9].length - 2, 2);
            });
        if (this.mode == 1) {
            // If the game mode is 1 it gets the DAILY quiz (unifies all 4 answers and shuffles them)
            fetch(` ../leagueOfTrivialG2/public/api/get-daily`)
                .then((response) => response.json())
                .then((data) => {
                    this.questions = JSON.parse(data);
                    for (let index = 0; index < this.questions.length; index++) {
                        this.questions[index].done = false;
                        this.questions[index].answers = [];
                        this.questions[index].answers.push({ "text": this.questions[index].correctAnswer, "estat": true });
                        this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[0], "estat": false });
                        this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[1], "estat": false });
                        this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[2], "estat": false });
                        this.questions[index].answers = this.questions[index].answers.sort((a, b) => 0.5 - Math.random());
                    }
                    this.startGame();
                });
        }
        if (this.mode == 2) {
            // If the game mode is 2 it gets the DEMO quiz (unifies all 4 answers and shuffles them)
            fetch(` ../leagueOfTrivialG2/public/api/get-demo`)
                .then((response) => response.json())
                .then((data) => {
                    this.questions = JSON.parse(data);
                    for (let index = 0; index < this.questions.length; index++) {
                        this.questions[index].done = false;
                        this.questions[index].answers = [];
                        this.questions[index].answers.push({ "text": this.questions[index].correctAnswer, "estat": true });
                        this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[0], "estat": false });
                        this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[1], "estat": false });
                        this.questions[index].answers.push({ "text": this.questions[index].incorrectAnswers[2], "estat": false });
                        this.questions[index].answers = this.questions[index].answers.sort((a, b) => 0.5 - Math.random());
                    }
                    this.startGame();
                });
        }

    },
    props: {
        mode: {
            type: String,
            default: '0'
        }
    },
    data: function () {
        return {
            gameType: {
                difficulty: "",
                category: "",
                type: "",
            },
            checked: false,
            dailyChecked: false,
            playVisible: false,
            questions: {
            },
            categories: {
                key: "",
                value: ""
            }
        }
    },
    methods: {
        getQuiz: function () {
            //Gets the game from the-trivia-api depending on the category and difficulty chosen by the user (unifies all 4 answers and shuffles them)
            fetch(`https://the-trivia-api.com/api/questions?categories=${this.gameType.category}&limit=10&difficulty=${this.gameType.difficulty}`)
                .then((response) => response.json())
                .then((data) => {
                    this.questions = data;

                    for (let index = 0; index < this.questions.length; index++) {
                        this.questions[index].done = false;
                        this.questions[index].answers = [];
                        this.questions[index].answers.push({ "text": data[index].correctAnswer, "estat": true });
                        this.questions[index].answers.push({ "text": data[index].incorrectAnswers[0], "estat": false });
                        this.questions[index].answers.push({ "text": data[index].incorrectAnswers[1], "estat": false });
                        this.questions[index].answers.push({ "text": data[index].incorrectAnswers[2], "estat": false });
                        this.questions[index].answers = this.questions[index].answers.sort((a, b) => 0.5 - Math.random());
                    }
                    this.startGame();
                });
        },
        startGame: function () {
            // Sets checked to true, so that the game starts
            const datos = {
                difficulty: null,
                category: null,
                quiz: null,
            }
            const inGameData = {
                idGame: null,
                idUser: userStore().loginInfo.id
            }
            if (this.mode == 0) {
                datos.difficulty = this.gameType.difficulty;
                datos.category = this.gameType.category;
                datos.quiz = this.questions;
                this.gameType.type = "normal";
                // If the game mode is 0 ("normal" game), it saves the game data in the database, since it is a whole new game
                fetch("../leagueOfTrivialG2/public/api/store-data", {
                    method: 'POST',
                    body: JSON.stringify(datos),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                }).then(response => {
                    return response.json()
                }).then(data => {
                    inGameData.idGame = data;
                    // Once the game is saved, it assigns the current game to the user, so that (if user leaves the game) it can be penalized
                    // Once the game is finished, it will return to 0, so that it means that the user is no longer playing (or did not leave the game)
                    fetch("../leagueOfTrivialG2/public/api/set-ingame", {
                        method: 'POST',
                        body: JSON.stringify(inGameData),
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    })
                });
            } if (this.mode == 1) {
                datos.difficulty = null;
                datos.category = null;
                datos.quiz = this.questions;
                this.gameType.type = "daily";
                // It assigns the current game to the user, so that (if user leaves the game) it can be penalized
                // Once the game is finished, it will return to 0, so that it means that the user is no longer playing (or did not leave the game)
                fetch("../leagueOfTrivialG2/public/api/set-ingame", {
                    method: 'POST',
                    body: JSON.stringify(inGameData),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
            }
            if (this.mode == 2) {
                datos.difficulty = null;
                datos.category = null;
                datos.quiz = this.questions;
                this.gameType.type = "demo";
            }
            this.checked = true;
        }
    },
    template: `<div>
                <barra-nav></barra-nav>
                <div v-show="mode==0">
                    <div class="centerItems quiz-lobby" v-show="!checked">
                        <div class="quiz-lobby__titulo">Choose difficulty</div>
                        <div class="input-container">
                            <div>
                                <input type="radio" id="easy" value="easy" v-model="gameType.difficulty">
                                <label class="easy-difficulty" for="easy">Easy</label>
                            </div>
                            <div v-if="getRupees>1000">
                                <input type="radio" id="medium" value="medium" v-model="gameType.difficulty">
                                <label class="medium-difficulty" for="medium">Medium</label>

                            </div>
                            <div v-if="getRupees<=1000">
                                <input type="radio" id="medium" value="medium">
                                <label class="medium-difficulty disabled">Medium</label>
                                <p class="alert-message">You need minimum 1000 <span><img src="../img/rupia.png" width="10px"></span></p>
                            </div>
                            <div v-if="getRupees>2500">
                                <input type="radio" id="hard" value="hard" v-model="gameType.difficulty">
                                <label class="hard-difficulty" for="hard">Hard</label>
                            </div>
                            <div v-if="getRupees<=2500">
                                <input type="radio" id="hard" value="hard" v-model="gameType.difficulty">
                                <label class="hard-difficulty disabled" for="hard">Hard</label>
                                <p class="alert-message">You need minimum 2500 <span><img src="../img/rupia.png" width="10px"></span></p>
                            </div>
                        </div>
                        <div class="quiz-lobby__titulo">Choose category</div>
                        <div class="input-container-categories">
                            <div v-for="(gameCategory,index) in categories.key" class="category">
                                <input type="radio" :id="categories.value[index]" :value="categories.value[index].join()" v-model="gameType.category">
                                <label :for="categories.value[index]" :style="{ 'background-image': 'url(../img/' + categories.value[index] + '.png)' }"></label>
                                {{gameCategory}}
                            </div>
                        </div>
                        <button v-show="gameType.category && gameType.difficulty" class="quiz-lobby__button" @click="getQuiz();">Take Quiz!</button>
                    </div>
                    <div v-show="checked">
                        <quiz :quiz="questions" :gameConfig="gameType"></quiz>
                    </div>
                </div>
                <div v-show="mode==1">
                    <quiz :quiz="questions" :gameConfig="gameType"></quiz>
                </div>
                <div v-show="mode==2">
                    <quiz :quiz="questions" :gameConfig="gameType"></quiz>
                </div>
              </div>`,
    computed: {
        getRupees() {
            return userStore().loginInfo.rupees;
        }
    }
})
const quiz = Vue.component('quiz', {
    props: ['quiz', 'gameConfig', 'challengeInfo'],
    data: function () {
        return {
            selectedAnswers: [],
            finished: false,
            score: 0,
            increment: 0,
            currentQuestion: 0,
            winner: 0,
            nCorrect: 0,
            counter: 150,
            countdown: null,
            tip: "",
            pointsUp: false
        }
    },
    created() {
        this.countdown = setInterval(this.decrementSeconds, 1000)

        // Alert displays if user tries to leave of close the game
        window.onbeforeunload = function () {
            return "If you leave now you will be penalized with a deduction of 250 rupees. Are you sure?";
        }
    },
    template: `<div>
                    <div v-show="!this.finished" style="text-align:center">
                        <p v-show="this.gameConfig.type!='demo'" id="number" class="game_info">Total: {{score}} <span><img src="../img/rupia.png" width="10px"></span></p>
                        <p v-show="this.gameConfig.type=='demo'" class="game_info">You are playing a demo</p>
                        <p class="timer">{{timeLeft}}</p><br>
                        <div v-for="(dades,index) in quiz" v-show="currentQuestion==index">
                            <p v-if="pointsUp" class="tips plustip">{{tip}}&nbsp<span><img src="../img/rupia.png" width="10px"></span></p>
                            <card :question="dades" :number="index" @changeQuestion="changeCard" @gameStatus="saveAnswer"></card>    
                            <br><br>
                        </div>
                    </div>
                    <div v-show="this.finished && this.gameConfig.type=='normal' || this.finished && this.gameConfig.type=='daily'" >
                        <div class="textoCentrado">
                            <h2 class="textoFinQuiz">Your score was:<br>{{nCorrect}}/10 in {{timeLeft}} seconds<br><br>+ {{score}} <span><img src="../img/rupia.png" width="10px"></span></h2>
                        </div>
                        <div class="buttons-container">
                            <router-link :to="{ name: 'answers', params: { quizQuestions: this.quiz } }" class="seeAnswers">See answers</router-link>
                            <button @click="finishGame" class="button-home">Home</button>
                        </div>
                    </div>
                    <div v-show="this.finished && this.gameConfig.type=='demo'">
                        <div class="textoFinQuiz">
                            Your score was:<br>{{nCorrect}}/10 in {{timeLeft}} seconds <br>
                            Would you like to see more?<br>
                            <router-link to="/register" class="link-register">JOIN THE LEAGUE NOW!</router-link><br>
                        </div>
                        <div class="textoCentrado">
                            <button @click="finishGame" class="button-home">Home</button>
                        </div>
                    </div>
                    <div v-if="this.finished && this.gameConfig.type=='challenge'">
                        <div class="centerChallengeResult">
                        <h2 class="textoFinChallenge">You've finished the challenge!</h2>
                        <h4>The results are ...</h4>
                                <div class="challenge">
                                    <div class="challenge__challenger">
                                        <i v-if="winner==this.challengeInfo.idChallenger" class="bi bi-trophy-fill trophy"></i>
                                        <div v-else class="challenge__challenger__loser"></div>
                                        <div class="perfilAvatar" :style="{backgroundImage: 'url('+this.challengeInfo.challengersImage+')'}"></div>
                                        {{this.challengeInfo.challengersName}} <br>
                                        {{score}} points
                                    </div>
                                    <div style="font-size: 30px">VS</div>
                                    <div class="challenge__challenged">
                                        <i v-if="winner==this.challengeInfo.idChallenged" class="bi bi-trophy-fill trophy"></i> 
                                        <div v-else class="challenge__challenger__loser"></div>
                                        <div class="perfilAvatar" :style="{backgroundImage: 'url('+this.challengeInfo.challengedsImage+')'}"></div>
                                        {{this.challengeInfo.challengedsName}} <br>
                                        {{this.challengeInfo.challengedsScore}} points
                                    </div>
                                </div>
                                <br>
                                <div v-show="winner==this.challengeInfo.idChallenger" class="challenge__title">Congrats, you've won <i class="bi bi-emoji-sunglasses-fill" style="color:white"></i></div>
                                <div v-show="winner==this.challengeInfo.idChallenged" class="challenge__title">Oh, no... You've lost <i class="bi bi-emoji-frown-fill" style="color:white"></i></div>
                                <div v-show="winner==0" class="challenge__title">IT'S A TIE <i class="bi bi-emoji-dizzy-fill" style="color:white"></i></div>
                                <div class="buttons-container">
                                    <router-link :to="{ name: 'answers', params: { quizQuestions: this.quiz } }" class="seeAnswers">See answers</router-link>
                                    <button @click="finishGame" class="button-home">Home</button>
                                </div>
                            </div>
                        </div>                        
                </div>`,
    methods: {
        decrementSeconds: function () {
            // Countdown of the game, when reaches 0, sets finished to true: it means the game is over
            if (this.counter > 0) {
                this.counter--
                return
            }
            if (this.counter === 0) {
                this.finished = true;
                clearInterval(this.countdown)
                this.increaseScoreFinal();
                this.saveGame();
            }
        },
        increaseScore: function () {
            // Animation effect that increases the score given for each question
            let start = this.score;
            this.score += this.increment;
            let end = this.score;
            let ticks = 20;
            let speed = 10;
            let randomNumbers = [end]

            for (let i = 0; i < ticks - 1; i++) {
                randomNumbers.unshift(
                    Math.floor(Math.random() * (end - start + 1) + start)
                );
            }
            randomNumbers.sort((a, b) => { return a - b });

            let x = 0;
            let interval = setInterval(() => {
                this.score = randomNumbers.shift();
                if (++x === ticks) {
                    window.clearInterval(interval);
                }
            }, speed);

        },
        increaseScoreFinal: function () {
            // Animation effect that increases the score given in the whole game
            let start = 0;
            let end = this.score;
            let ticks = 40;
            let speed = 20;

            let randomNumbers = [end]

            for (let i = 0; i < ticks - 1; i++) {
                randomNumbers.unshift(
                    Math.floor(Math.random() * (end - start + 1) + start)
                );
            }
            randomNumbers.sort((a, b) => { return a - b });

            let x = 0;
            let interval = setInterval(() => {
                this.score = randomNumbers.shift();
                if (++x === ticks) {
                    window.clearInterval(interval);
                }
            }, speed);

        },
        saveAnswer: function (respuesta, index) {
            // Saves the answer chosen for each question (data given by the card component)
            // If the answer is correct, it will increment the score (as well as the amount of correct answers) 
            // and it appears an animation with the obtained score in that question (depending on the difficulty and game type)
            this.selectedAnswers[index] = respuesta;
            if (respuesta == this.quiz[index].correctAnswer) {
                this.nCorrect++;
                if (this.gameConfig.type == "normal" || this.gameConfig.type == "challenge") {
                    switch (this.gameConfig.difficulty) {
                        case "easy":
                            this.pointsUp = true;
                            this.tip = "+25";
                            this.increment = 25;
                            this.increaseScore();
                            break;
                        case "medium":
                            this.pointsUp = true;
                            this.tip = "+50";
                            this.increment = 50;
                            this.increaseScore();
                            break;
                        case "hard":
                            this.pointsUp = true;
                            this.tip = "+75";
                            this.increment = 75;
                            this.increaseScore();
                            break;
                    }
                } else if (this.gameConfig.type == "daily") {
                    this.tip = "+10";
                    this.increment = 10;
                    this.increaseScore();
                    this.pointsUp = true;
                }
            }
        },
        changeCard: function () {
            // Change to another question
            // If the amount of selected answers is equal to the quiz length, then the game is over
            // Applies the time left to the actual score
            // For the challenge case, it checks who is the winner
            this.currentQuestion++;
            this.pointsUp = false;
            if (this.selectedAnswers.length == this.quiz.length) {
                this.score = ((this.score * this.timeLeft) / 100) + this.score
                this.score = Math.round(this.score);
                if (this.gameConfig.type == "challenge") {
                    if (this.score > this.challengeInfo.challengedsScore) {
                        this.winner = this.challengeInfo.idChallenger;
                    } else if (this.score < this.challengeInfo.challengedsScore) {
                        this.winner = this.challengeInfo.idChallenged;
                    } else {
                        this.winner = 0;
                    }
                }
                this.finished = true;
                clearInterval(this.countdown)
            }
            if (this.finished) {
                this.increaseScoreFinal();
                this.saveGame();
            }
        },
        saveGame: function () {
            // Saves the score of the game
            const params = {
                score: this.score,
                idUser: userStore().loginInfo.id
            }
            // For NORMAL game, saves the score in the ranking and sets the current game to 0 again (so that you don't get penalized)
            if (this.gameConfig.type == "normal") {
                fetch("../leagueOfTrivialG2/public/api/store-score", {
                    method: 'POST',
                    body: JSON.stringify(params),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                fetch("../leagueOfTrivialG2/public/api/set-finishedGame", {
                    method: 'POST',
                    body: JSON.stringify(params),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                userStore().loginInfo.rupees += this.score;
            }
            // For DAILY game, saves the score in the ranking and sets the current game to 0 again (so that you don't get penalized)
            // It also turns dailyPlayed to 1, so that means you have already played the daily game today (you won't be able to play it until the next day, when it will return to 0)
            if (this.gameConfig.type == "daily") {
                fetch("../leagueOfTrivialG2/public/api/store-dailyScore", {
                    method: 'POST',
                    body: JSON.stringify(params),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                fetch("../leagueOfTrivialG2/public/api/dailyPlayed", {
                    method: 'POST',
                    body: JSON.stringify(params),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                userStore().loginInfo.dailyPlayed = 1;

            }
            // For CHALLENGE game, saves the challenger user, the challenged one and the winner
            if (this.gameConfig.type == "challenge") {
                challengeParams = {
                    idChallenger: this.challengeInfo.idChallenger,
                    idChallenged: this.challengeInfo.idChallenged,
                    winner: this.winner,
                    idGame: this.challengeInfo.idGame,
                }
                fetch("../leagueOfTrivialG2/public/api/store-challenge", {
                    method: 'POST',
                    body: JSON.stringify(challengeParams),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
            }
        },
        finishGame() {
            // When the game is finished, it redirects to the landing page
            this.finished = false;
            // onbeforeunload is nulled, so that it ONLY affects during the game
            window.onbeforeunload = null
            this.$router.push({ path: '/' })
        }
    },
    computed: {
        getUser() {
            return userStore().loginInfo.id;
        },
        timeLeft() {
            return this.counter;
        }
    }
})
const card = Vue.component('card', {
    props: ['question', 'number'],
    data: function () {
        return {
            activeButton: ''
        }
    },
    template: `<div>
    <div id="num_pregunta">{{number+1}} / 10</div>
    <div id="gamecard-juego">
    <div class="pregunta">
        <div>{{question.question}}</div>
    </div>
    <div id="gamecard-respuestas">
        <div v-for="(respuesta,index) in question.answers">
            <button type="radio" class="respuesta" :style="animation(index)" :disabled='question.done'
                :class="{'false': !respuesta['estat'] & question.done, 'correct': respuesta['estat'] & question.done, 'selected': activeButton === index ? 'notSelected' : ''}"
                @click="checkAnswer(respuesta['text'], number, index);">{{respuesta['text']}}</button>
        </div>
        <div v-show="question.done">
            <b-button class="next" @click="$emit('changeQuestion')">NEXT<span class="arrow"></span></b-button>
        </div>
    </div>
</div>
</div>`,
    methods: {
        checkAnswer: function (respuesta, index, numResposta) {
            // When user clicks in an answer, all of the answers disable and the chosen one will be shown as selected
            this.question.done = false
            this.activeButton = numResposta;
            if (!this.question.done) {
                this.question.done = true;
                // So that we see changes, we forced an update (otherwise, correct and incorrect answers won't be shown)
                this.$forceUpdate();
                this.$emit('gameStatus', respuesta, index);
            }
        },
        animation: function (num) {
            // Pop animation for each answer (it has an increasing delay for each one)
            return `animation-delay: ${num * 0.2}s`;
        }
    }
})
const answers = Vue.component('answers', {
    props: ['quizQuestions'],
    template: `<div>
                    <barra-nav></barra-nav>
                    <div class="solutions">
                        <h1 class="solutions__title">QUIZ SOLUTIONS</h1>
                        <div v-for="(question, index) in quizQuestions">
                            <h3>{{index+1}}. {{question.question}}</h3>
                            <ul v-for="(respuesta,num) in question.answers">
                                <li :class="{'wrongAnswer': !respuesta['estat'], 'correctAnswer': respuesta['estat']}">{{respuesta['text']}}</li>
                            </ul>
                            <br>
                        </div>
                        <button class="button-home"><router-link to="/">Home</router-link></button>
                    </div>
                </div>`
})
const profile = Vue.component("profile", {
    props: ['idUser'],
    data: function () {
        return {
            user: { "info": [{ "name": "", "userName": "", "imageUrl": "https://avatars.dicebear.com/api/croodles/611347.svg?", "email": "", "status": null, "rupees": 0 }], "historic": [{ "puntuacio": 0, "idUser": 0, "idGame": 0, "date": "", "difficulty": "", "category": "" }], "quantCateg": [{ "quant": 0, "category": "" }] },
            userChallenges: [
                challengesMade = {},
                challengesFaced = {},
            ],
            loadedData: false,
            infoChallenge: [],
            message: '',
            saved: false,
            categories: [],
            edit: false,
            categoriesTag: [],
            quant: []
        }
    },
    template: `<div>
                    <barra-nav></barra-nav>
                    <div v-if="loadedData" id="centrarPerfil">
                        <div class="centerItems" id="gridPerfil">
                            <div v-if="idUser==getUser" class="header2" id="profile_Header">
                                <div class="header2_div2">
                                    <button @click="editProfile" class="profile_edit" v-show="!edit">Edit</button>
                                </div>
                            </div>
                            <div class="perfilAvatar" :style="{backgroundImage: 'url('+this.user.info[0].imageUrl+')'}"></div>
                                <div v-if="edit">
                                    <button @click="changeAvatar" class="profile_changeAvatar">Change Avatar</button>
                                </div>
                            <div>{{this.user.info[0].rupees}} <span><img src="../img/rupia.png" width="10px"></span></div>
                            <div class="perfilNombre" v-if="!edit">{{this.user.info[0].name}}</div>
                            <input v-if="edit" v-model="user.info[0].name" class="perfilNombre editName" style="border:1px solid white" type="text"></input>
                            <div class="perfilInfo">{{this.user.info[0].userName}}</div>
                            <div class="perfilInfo">{{this.user.info[0].email}}</div>
                            <div v-if="this.user.info[0].status==null && !edit || this.user.info[0].status=='' && !edit" class="profileStatus">
                                Tell everyone something about you!
                            </div>
                            <div v-if="this.user.info[0].status!=null && this.user.info[0].status!='' && !edit" class="profileStatus">
                                "{{this.user.info[0].status}}"
                            </div>
                            <input v-if="edit" v-model="user.info[0].status" class="profileStatus editStatus" type="text"></input>
                            <p v-if="saved" class="success_message">{{this.message}}</p>
                            <div v-if="edit">
                                <button @click="save" class="profile_edit">SAVE</button>
                            </div>
                            <div class="categoriesPlayed">
                                <div v-for="(category,index) in user.quantCateg" class="categories-container" :style="{ 'background-image': 'url(../img/' + category.category + '.png)' }"><p>{{categoriesTag[index]}}<br>{{category.quant}}</p></div>
                            </div>
                            <div class="lastPlayed">
                                <p class="profile_title">Last Played</p>
                                <p v-if="user.historic.length < 1">No games played yet.</p>
                                <table class="lastPlayed_table">
                                    <tr v-for="(game,index) in user.historic">
                                        <td>{{game.date}}</td>
                                        <td>{{game.category}}</td>
                                        <td>{{game.difficulty}}</td>
                                        <td>{{game.puntuacio}}</td>
                                        <td v-if="idUser!=getUser && isLogged"><img src="../img/challenge.png" class="challenge_icon" @click="startChallenge(index)" title="Start a challenge!"></td>
                                    </tr>
                                </table>
                            </div>

                            <div class="lastChallenges">
                                <p class="profile_title">Last Challenges</p>
                                <p v-show="this.userChallenges.challengesMade.length < 1 && this.userChallenges.challengesFaced.length < 1">No challenges played yet.</p>
                                <div v-for="(challenge,index) in userChallenges.challengesMade">
                                    <b-avatar variant="info" class="avatar" :src="user.info[0].imageUrl" :title="user.info[0].userName"></b-avatar>
                                    <span style="font-size:20px">VS</span>
                                    <b-avatar variant="info" class="avatar" :src="challenge.imageUrl" :title="challenge.userName"></b-avatar>
                                    <span v-show="challenge.winner==idUser"><img src="../img/trophy.png" class="medal"></span>
                                    <span v-show="challenge.winner!=idUser"><img src="../img/looser.png" class="medal"></span>
                                </div>
                                
                                <div v-for="(faced,index) in userChallenges.challengesFaced">
                                    <b-avatar class="avatar" variant="info" :src="faced.imageUrl" :title="faced.userName"></b-avatar>
                                    <span style="font-size:20px">VS</span>
                                    <b-avatar variant="info" class="avatar" :src="user.info[0].imageUrl" :title="user.info[0].userName"></b-avatar>
                                    <span v-show="faced.winner==idUser"><img src="../img/trophy.png" class="medal"></span>
                                    <span v-show="faced.winner!=idUser"><img src="../img/looser.png" class="medal"></span>
                                </div>
                                
                            </div>
                            <div class="chart">
                                <p class="profile_title">Your Statistics</p>
                                <p v-if="this.quant.length<1">No games played yet.</p>
                                <canvas v-show="this.quant.length>=1" id="myChart"></canvas>
                            </div>
                        </div>
                    </div>
                    <foter></foter>
                </div>`,
    mounted() {
        params = {
            idUser: this.idUser
        }
        // Gets all of the information related to the current user
        fetch("../leagueOfTrivialG2/public/api/get-userRanking", {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            }
        }).then(response => {
            return response.json()
        }).then(data => {
            this.user = data;
            // Array of categories used in the chart
            for (let i = 0; i < this.user.quantCateg.length; i++) {
                this.categoriesTag[i] = this.user.quantCateg[i].category
                this.quant[i] = this.user.quantCateg[i].quant
                switch (this.categoriesTag[i]) {
                    case "arts_and_literature": this.categoriesTag[i] = "Arts & Literature"
                        break;
                    case "film_and_tv": this.categoriesTag[i] = "Film & TV"
                        break;
                    case "food_and_drink": this.categoriesTag[i] = "Food & Drink"
                        break
                    case "general_knowledge": this.categoriesTag[i] = "General Knowledge"
                        break
                    case "geography": this.categoriesTag[i] = "Geography"
                        break
                    case "history": this.categoriesTag[i] = "History"
                        break
                    case "music": this.categoriesTag[i] = "Music"
                        break
                    case "science": this.categoriesTag[i] = "Science"
                        break
                    case "society_and_culture": this.categoriesTag[i] = "Culture"
                        break
                    case "sport_and_leisure": this.categoriesTag[i] = "Sport & Leisure"
                        break
                }
            }
            // Array of categories and difficulties used for the game historic
            for (let i = 0; i < this.user.historic.length; i++) {
                switch (this.user.historic[i].category) {
                    case "arts_and_literature": this.user.historic[i].category = "Arts & Literature"
                        break;
                    case "film_and_tv": this.user.historic[i].category = "Film & TV"
                        break;
                    case "food_and_drink": this.user.historic[i].category = "Food & Drink"
                        break
                    case "general_knowledge": this.user.historic[i].category = "General Knowledge"
                        break
                    case "geography": this.user.historic[i].category = "Geography"
                        break
                    case "history": this.user.historic[i].category = "History"
                        break
                    case "music": this.user.historic[i].category = "Music"
                        break
                    case "science": this.user.historic[i].category = "Science"
                        break
                    case "society_and_culture": this.user.historic[i].category = "Culture"
                        break
                    case "sport_and_leisure": this.user.historic[i].category = "Sport & Leisure"
                        break
                }
                switch (this.user.historic[i].difficulty) {
                    case "easy": this.user.historic[i].difficulty = "Easy"
                        break;
                    case "medium": this.user.historic[i].difficulty = "Medium"
                        break;
                    case "hard": this.user.historic[i].difficulty = "Hard"
                }
            }

            //Array that displays how many days ago was each game played
            for (let index = 0; index < this.user.historic.length; index++) {
                var historial = new Date(this.user.historic[index].date);
                var todayDate = new Date();
                let difference = todayDate - historial;
                let TotalDays = Math.ceil(difference / (1000 * 3600 * 24)) - 1;

                if (TotalDays == 0) {
                    this.user.historic[index].date = "Today";
                } else {
                    this.user.historic[index].date = TotalDays + " days ago";
                }
            }

            setTimeout(() => {
                // Chart of the categories the user has played
                ctx = document.getElementById('myChart');
                tmp_chart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: this.categoriesTag,
                        datasets: [{
                            label: 'Times played',
                            data: this.quant,
                            borderWidth: 3
                        }],
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: true,
                                align: 'start',
                                labels: {
                                    color: 'rgb(255,255,255)',
                                    padding: 20,
                                    boxWidth: 12
                                }
                            }
                        }
                    }
                });
            }, 100);
        });
        setTimeout(() => {
            // Gets the information of the challenges the user has faced or made, this information will be displayed on another historic
            fetch("../leagueOfTrivialG2/public/api/get-userChallenges", {
                method: 'POST',
                body: JSON.stringify(params),
                headers: {
                    "Content-type": "application/json;charset=UTF-8"
                }
            }).then(response => {
                return response.json()
            }).then(data => {
                this.userChallenges = data;
                this.loadedData = true;
            });
        }, 10);
    },
    methods: {
        startChallenge(idGame) {
            // If the user it is not itself, it can challenge the current user
            // For this, this method makes an array with all the information needed to start the challenge
            // Next, it redirects to the challenge window
            this.infoChallenge.idChallenger = userStore().loginInfo.id;
            this.infoChallenge.challengersName = userStore().loginInfo.userName;
            this.infoChallenge.challengersImage = userStore().loginInfo.imageUrl;
            this.infoChallenge.idChallenged = this.idUser;
            this.infoChallenge.challengedsName = this.user.info[0].userName;
            this.infoChallenge.challengedsImage = this.user.info[0].imageUrl;
            this.infoChallenge.challengedsScore = this.user.historic[idGame].puntuacio;
            this.infoChallenge.idGame = this.user.historic[idGame].idGame;
            this.infoChallenge.category = this.user.historic[idGame].category;
            this.infoChallenge.difficulty = this.user.historic[idGame].difficulty;
            this.$router.push({ name: 'challenge', params: { infoChallenge: this.infoChallenge } })
        },
        changeAvatar: function () {
            // User can change the avatar to a random one provided by Dice Bears Avatars
            let num = 0;
            userAvatar = '';
            this.changeImg = true;
            type = ["bottts", "croodles", "micah"];
            num = Math.floor(Math.random() * 1000000);
            userAvatar = type[Math.floor(Math.random() * 3)];
            this.user.info[0].imageUrl = "https://avatars.dicebear.com/api/" + userAvatar + "/" + num + ".svg?"
        },
        editProfile: function () {
            // When user clicks the "Edit" button, the variable will turn to true and the user will be able to edit its profile picture, name and status
            this.edit = true;
        },
        save: function () {
            // Updates the new profile pic, name or status changed by the user
            let form = {
                idUser: this.idUser,
                imageUrl: this.user.info[0].imageUrl,
                status: this.user.info[0].status,
                name: this.user.info[0].name
            }
            fetch(`../leagueOfTrivialG2/public/api/update-profile`, {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    "Content-type": "application/json;charset=UTF-8"
                }
            }).then(response => response.json())
                .then(data => {
                    this.message = "Your changes have been successfuly updated";
                    this.saved = true;
                    this.edit = false;
                    userStore().loginInfo.imageUrl = this.user.info[0].imageUrl
                });
        }
    },
    computed: {
        getUser() {
            return userStore().loginInfo.id;
        },
        isLogged() {
            return userStore().logged;
        }
    }
})
const login = Vue.component("login", {
    props: [],
    data: function () {
        return {
            processing: false,
            form: {
                email: '',
                password: ''
            },
            perfil: {},
            errors: [],
            visibility: false,
            inputType: "password"
        }
    },
    template: `<div>
                <b-modal class="screen" id="login" title="We are happy that you are back!">
                <div @keyup.enter="login">
                <span class="error_message">{{this.errors['error']}}</span>
                    <div class="login__field">
                        <i class="login__icon bi bi-person-fill"></i>
                        <b-form-input id="input-2" class="login__input" v-model="form.email"
                            placeholder="Write your email..." required>
                        </b-form-input>
                    </div>
                    <div class="login__field">
                        <i class="login__icon bi bi-lock-fill"></i>
                        <b-form-input id="input-3" class="login__input"  v-model="form.password" :type="this.inputType"
                            placeholder="Write your password..." required></b-form-input>
                            <i class="login__icon--hide bi bi-eye" @click="hide"></i>
                    </div>
                    
                    <div class="login_link-register">
                    Don't have an account yet?
                    <router-link to="/register" style="text-decoration: none;">
                        <span class="link-register"> Join the league now!</span>
                    </router-link>
                    </div>
                </div>
                <template #modal-footer>
                    <div>
                        <div v-show="!processing" class="boton">
                            <button v-b-modal.modal-close_visit class="login-button" @click="login">Login</button>
                        </div>
                        <div v-show="processing" class="boton">
                        <button v-b-modal.modal-close_visit class="login-button" disabled>
                                <b-spinner small type="grow"></b-spinner>
                                Loading
                            </button>
                        </div>
                    </div>
                </template>
            </b-modal>
        </div>`,
    methods: {
        login: async function () {
            // Attempts to login the user
            // If attempt fails, it displays an error message depending on the error code
            // If attempt succeds, it saves the user information to the Pinia store and closes the modal
            this.processing = true;
            try {
                await fetch("../leagueOfTrivialG2/public/api/login", {
                    method: 'POST',
                    body: JSON.stringify(this.form),
                    headers: {
                        "Content-type": "application/json;charset=UTF-8"
                    }
                }).then(response => {
                    console.log(response);
                    return response.json()
                })
                    .then(data => {
                        this.processing = false;
                        this.errors = data;
                        if (this.errors['code'] != 401 && this.errors['code'] != 400) {
                            this.perfil = data;
                            store = userStore();
                            store.setEstado(this.perfil);
                            store.logged = true;
                            this.perfil = {};
                            this.form.email = '';
                            this.form.password = '';
                            this.$router.push({ path: '/' });
                        }
                    }).catch(err => { console.log(err); });
            } catch (error) {
                console.log(error);
            }
        },
        hide: function () {
            // Shows and/or hides the password
            if (!this.visibility) {
                this.inputType = "text";
                this.visibility = true;
            } else {
                this.inputType = "password";
                this.visibility = false;
            }
        }
    },
    computed: {
        isLogged() {
            return userStore().logged;
        },
        userName() {
            return userStore().loginInfo.name;
        }
    }

})
const register = Vue.component("register", {
    data: function () {
        return {
            processing: false,
            form: {
                name: '',
                username: '',
                email: '',
                password: '',
                avatar: ''
            },
            numRandom: 0,
            userAvatarType: '',
            type: ["bottts", "croodles", "micah"],
            validEmail: false,
            validName: false,
            validUserName: false,
            validPass: false,
            result: [],
            visibility: false,
            inputType: "password",
            errorMessage: ''
        }
    },
    template: `<div>
                <barra-nav></barra-nav>
                <div class="login-container">
                    <div class="screen">
                        <div class="screen__content">
                            <form class="login" @keyup.enter="send">
                                <div class="login__title">JOIN THE LEAGUE!</div>
                                <div class="register__form">
                                    <div class="login__field">
                                        <i class="login__icon bi bi-info-circle-fill"></i>
                                        <input type="text" class="login__input" v-model="form.name" @keyup="validarName"
                                            placeholder="Name">
                                        <div v-if="validName && form.name.length>0" class="box">
                                            <p class="success_message">Valid name :)</p>
                                        </div>
                                        <div v-if="!validName && form.name.length>0" class="box">
                                            <p class="error_message">Name must contain at least 3 characters.</p>
                                        </div>
                                    </div>
                                    <div class="login__field">
                                        <i class="login__icon bi bi-envelope-fill"></i>
                                        <input type="email" class="login__input" v-model="form.email" @keyup="validar"
                                            placeholder="Email">
                                        <div v-show="validEmail && form.email.length>0">
                                            <p class="success_message">Valid email :)</p>
                                        </div>
                                        <div v-show="!validEmail && form.email.length>0">
                                            <p class="error_message">Invalid Email :(</p>
                                        </div>
                                    </div>
                                    <div class="login__field">
                                        <i class="login__icon bi bi-person-fill"></i>
                                        <input type="text" class="login__input" v-model="form.username" @keyup="validarUserName"
                                            placeholder="Username">
                                        <div v-show="validUserName && form.username.length>0">
                                            <p class="success_message">Valid user name :)</p>
                                        </div>
                                        <div v-show="!validUserName && form.username.length>0">
                                            <p class="error_message">Name can only contain alphanumeric characters.</p>
                                        </div>
                                    </div>
                                    <div class="login__field">
                                        <i class="login__icon bi bi-lock-fill"></i>
                                        <input :type="this.inputType" class="login__input" v-model="form.password" @keyup="validarPass"
                                            placeholder="Password here">
                                        <i class="login__icon--hide bi bi-eye" @click="hide"></i>

                                        <div v-show="validPass && form.password.length>0">
                                            <p class="success_message">Valid Password :)</p>
                                        </div>
                                        <div v-show="!validPass && form.password.length>0">
                                            <p class="error_message">Password requires minimum eight characters, at least one letter and
                                                one
                                                number.</p>
                                        </div>
                                    </div>
                                    <span class="error_message">{{this.errorMessage}}</span>
                                </div>
                                <b-button v-if="this.validEmail && this.validName && this.validUserName && this.validPass" class="login-button" @click="send">Sign Up</b-button>
                            </form>
                        </div>
                    </div>
                  </div>
                  <foter></foter>
                </div>`,

    methods: {
        validar: function () {
            //https://regexr.com/3e48o
            // Checks the email address contains a valid email address
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.form.email)) {
                this.validEmail = true;
            } else if (this.form.email.length > 0) {
                this.validEmail = false;
            }
        },
        validarName: function () {
            //Checks the name is minimum 3 characters, max 20 characters and characters a-z/A-Z
            if (/^[a-zA-Z]{3,20}$/.test(this.form.name)) {
                this.validName = true;

            } else if (this.form.name.length > 0) {
                this.validName = false;
            }
        },
        validarUserName: function () {
            // Checks the username is 8-20 characters long --- no _ or . at the beginning ---  no __ or _. or ._ or .. inside --- allowed characters --- no _ or . at the end
            if (/^[a-zA-Z0-9]{3,20}$/.test(this.form.username)) {
                this.validUserName = true;

            } else if (this.form.username.length > 0) {
                this.validUserName = false;
            }
        },
        validarPass: function () {
            //Checks the password is minimum eight characters, at least one letter and one number:
            if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(this.form.password)) {
                this.validPass = true;
            } else if (this.form.password.length > 0) {
                this.validPass = false;
            }
        },
        send: function (event) {
            // Registers the user in the database and assigns automatically a random image
            // If registration is successful, it redirects to the landing page
            this.numRandom = Math.floor(Math.random() * 1000000);
            this.userAvatarType = this.type[Math.floor(Math.random() * 3)];
            this.form.avatar = "https://avatars.dicebear.com/api/" + this.userAvatarType + "/" + this.numRandom + ".svg?"
            fetch("../leagueOfTrivialG2/public/api/store-user", {
                method: 'POST',
                body: JSON.stringify(this.form),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(response => response.json())
                .then(data => {
                    this.result = data;
                    if (this.result['name']) {
                        this.$router.push({ path: '/' });
                    } else {
                        this.errorMessage = "Email or username is already taken."
                    }
                });
        },
        hide: function () {
            // Shows and/or hides the password
            if (!this.visibility) {
                this.inputType = "text";
                this.visibility = true;
            } else {
                this.inputType = "password";
                this.visibility = false;
            }
        }
    }
})

// -----------------Vue Routes-----------------
const routes = [
    {
        path: '/game/:mode',
        component: lobby,
        props: true
    },
    {
        path: '/register',
        component: register
    }, {
        path: '/',
        component: home,
        children: [
            {
                path: '/login',
                component: login,
                name: 'modalLogin'
            }
        ]
    }, {
        path: '/profile/:idUser',
        name: 'profile',
        component: profile,
        props: true
    }, {
        path: '/answers',
        name: 'answers',
        component: answers,
        props: true
    }, {
        path: '/ranking',
        component: ranking
    }, {
        path: '/challenge',
        name: 'challenge',
        component: challenge,
        props: true
    }]

const router = new VueRouter({
    routes // short for `routes: routes`
})

// -----------------Vue Pinia-----------------
Vue.use(Pinia.PiniaVuePlugin);
const pinia = Pinia.createPinia();

const userStore = Pinia.defineStore('usuario', {
    state() {
        return {
            logged: false,
            loginInfo: {
                success: true,
                name: 'Nombre del almacen',
                image: '',
                idUser: ''
            }
        }
    },
    actions: {
        setEstado(i) {
            this.loginInfo = i
        }
    }
})

// -----------------Vue App-----------------
var app = new Vue({
    el: '#app',
    router,
    pinia,
    data: {

    },
    computed: {
        ...Pinia.mapState(userStore, ['loginInfo', 'logged'])
    },
    methods: {
        ...Pinia.mapActions(userStore, ['setEstado']),
        logOut: function () {
            store.logged = false;
            store.loginInfo = {};
            fetch("../leagueOfTrivialG2/public/api/logout", {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            if (this.$router.history.current.path != '/') {
                this.$router.push({ path: '/' })
            }
        }
    },

})
