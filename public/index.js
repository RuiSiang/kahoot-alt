class QuizPlatform {
    constructor() {
        this.socket = io();
        this.initSocketEvents();
    }

    initSocketEvents() {
        this.socket.on("question", question => this.handleQuestion(question));
        this.socket.on("connected", () => this.handleConnected());
        this.socket.on("correct", () => this.handleAnswerFeedback(true));
        this.socket.on("incorrect", () => this.handleAnswerFeedback(false));
        this.socket.on("noAnswer", () => this.handleNoAnswer());
        this.socket.on("gameover", leaderboard => this.handleGameOver(leaderboard));
    }

    async handleConnected() {
        const name = await swal("Your name:", {
            content: "input",
            button: "Join",
            closeOnClickOutside: false,
            closeOnEsc: false,
        });
        this.socket.emit("name", name);
        this.showLoader("Waiting for host");
    }

    async handleQuestion(question) {
        const shuffledAnswers = this.shuffleArray(question.answers);
        const answer = await swal({
            title: question.text,
            buttons: this.createAnswerButtons(shuffledAnswers),
            closeOnClickOutside: false,
            closeOnEsc: false,
        });
        this.socket.emit("answer", shuffledAnswers[answer - 1]);
        this.showLoader("Waiting for others");
    }

    handleAnswerFeedback(isCorrect) {
        const title = isCorrect ? "Correct!" : "Incorrect!";
        const text = isCorrect ? "Keep it up :)" : "Better luck next time :(";
        const icon = isCorrect ? "success" : "error";
        swal({ title, text, icon, buttons: false, closeOnClickOutside: false, closeOnEsc: false });
    }

    handleNoAnswer() {
        swal({
            title: "Time's up!",
            text: "You need to be quicker",
            icon: "error",
            buttons: false,
            closeOnClickOutside: false,
            closeOnEsc: false,
        });
    }

    async handleGameOver(leaderboard) {
        let leaderboardDisplay = document.createElement("ul");
        leaderboard.forEach(player => {
            leaderboardDisplay.innerHTML += `<li>${player[0]}: ${player[1]}</li>`;
        });
        swal({
            title: "Game over!",
            icon: "info",
            content: leaderboardDisplay,
            buttons: false,
            closeOnClickOutside: false,
            closeOnEsc: false,
        });
    }

    showLoader(message) {
        const loader = this.createLoader();
        swal({ title: message, buttons: false, content: loader, closeOnClickOutside: false, closeOnEsc: false });
    }

    createLoader() {
        const loader = document.createElement("div");
        loader.className = "loader";
        return loader;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    createAnswerButtons(answers) {
        return answers.reduce((buttons, answer, index) => {
            buttons[index + 1] = { text: answer, value: index + 1 };
            return buttons;
        }, {});
    }
}

const quizPlatform = new QuizPlatform();
quizPlatform.initSocketEvents();
