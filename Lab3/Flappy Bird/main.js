// --- KONFIGURACJA I ZMIENNE ---
const cvs = document.getElementById("bird-game");
const ctx = cvs.getContext("2d");

let frames = 0;
const DEGREE = Math.PI / 180;
let score = 0;
// Wczytujemy stary rekord na początku gry
let bestScore = parseInt(localStorage.getItem("flappy_best_score_val")) || 0;

const state = {
    current: 0,
    getReady: 0,
    game: 1,
    dying: 2,
    spin: 3,
    over: 4
};

// --- ASSETY ---
const bgImg = new Image();
bgImg.src = "assets/Flappy Bird/background-day.png";

const fgImg = new Image();
fgImg.src = "assets/Flappy Bird/base.png";

const birdUp = new Image();
birdUp.src = "assets/Flappy Bird/yellowbird-upflap.png";
const birdMid = new Image();
birdMid.src = "assets/Flappy Bird/yellowbird-midflap.png";
const birdDown = new Image();
birdDown.src = "assets/Flappy Bird/yellowbird-downflap.png";

const pipeNorthImg = new Image();
pipeNorthImg.src = "assets/Flappy Bird/pipe-green.png";
const pipeSouthImg = new Image();
pipeSouthImg.src = "assets/Flappy Bird/pipe-green.png";

const getReadyImg = new Image();
getReadyImg.src = "assets/UI/message.png";

// Ładowanie cyfr
const scoreImages = [];
for (let i = 0; i < 10; i++) {
    scoreImages[i] = new Image();
    scoreImages[i].src = `assets/UI/Numbers/${i}.png`;
}

// Dźwięki
const SCORE_S = new Audio("assets/Sound Efects/point.wav");
const FLAP_S = new Audio("assets/Sound Efects/wing.wav");
const HIT_S = new Audio("assets/Sound Efects/hit.wav");
const SWOOSH_S = new Audio("assets/Sound Efects/swoosh.wav");
const DIE_S = new Audio("assets/Sound Efects/die.wav");

// --- OBIEKTY GRY ---

const bg = {
    sX: 0, sY: 0, w: 275, h: 226, x: 0, y: cvs.height - 226,
    draw: function() {
        ctx.drawImage(bgImg, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(bgImg, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
};

const fg = {
    sX: 0, sY: 0, w: 336, h: 112, x: 0, y: cvs.height - 112, dx: 2,
    draw: function() {
        ctx.drawImage(fgImg, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(fgImg, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },
    update: function() {
        if (state.current === state.game) {
            this.x = (this.x - this.dx) % (this.w / 2);
        }
    }
};

const bird = {
    animation: [birdMid, birdUp, birdMid, birdDown],
    x: 50,
    y: 150,
    w: 34,
    h: 26,
    radius: 12,
    frame: 0,
    gravity: 0.19,
    jump: 3.6,
    speed: 0,
    rotation: 0,
    spinAngle: 0,

    draw: function() {
        let birdC = this.animation[this.frame];
        ctx.save();
        ctx.translate(this.x, this.y);

        if (state.current === state.getReady) {
            this.rotation = 0;
        } else if (state.current === state.spin) {
            ctx.rotate(this.spinAngle * DEGREE);
        } else {
            if (this.speed < 0) this.rotation = -25 * DEGREE;
            else {
                this.rotation += 5 * DEGREE;
                if (this.rotation > 90 * DEGREE) this.rotation = 90 * DEGREE;
            }
            if (state.current === state.dying && this.y >= cvs.height - fg.h) {
                this.rotation = 90 * DEGREE;
            }
            ctx.rotate(this.rotation);
        }

        ctx.drawImage(birdC, -this.w/2, -this.h/2, this.w, this.h);
        ctx.restore();
    },

    flap: function() {
        this.speed = -this.jump;
    },

    update: function() {
        const period = state.current === state.getReady ? 10 : 5;
        this.frame += frames % period === 0 ? 1 : 0;
        this.frame = this.frame % this.animation.length;

        if (state.current === state.getReady) {
            this.y = 150;
            this.rotation = 0;
        } else if (state.current === state.spin) {
            this.spinAngle += 15;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;

            if (this.y + this.h/2 >= cvs.height - fg.h) {
                this.y = cvs.height - fg.h - this.h/2;
                if (state.current === state.game) {
                    state.current = state.over;
                    HIT_S.play();
                    showGameOver();
                } else if (state.current === state.dying) {
                    state.current = state.over;
                    showGameOver();
                }
            }
        }
    }
};

const pipes = {
    position: [],
    w: 52,
    h: 400,
    gap: 100,
    dx: 2,

    draw: function() {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            let topY = p.y;
            let bottomY = p.y + this.h + this.gap;

            ctx.save();
            ctx.translate(p.x + this.w, topY + this.h);
            ctx.rotate(Math.PI);
            ctx.drawImage(pipeNorthImg, 0, 0, this.w, this.h);
            ctx.restore();

            ctx.drawImage(pipeSouthImg, p.x, bottomY, this.w, this.h);
        }
    },

    update: function() {
        if (state.current !== state.game) return;

        if (frames % 100 === 0) {
            this.position.push({
                x: cvs.width,
                y: -150 * (Math.random() + 1)
            });
        }

        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            p.x -= this.dx;

            if (p.x + this.w <= 0) {
                this.position.shift();
                score += 1;
                SCORE_S.play();
                // ZMIANA: Nie aktualizujemy bestScore tutaj!
                // Robimy to dopiero po przegranej, żeby porównać stary wynik z nowym.
            }

            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w) {
                if (bird.y - bird.radius < p.y + this.h || bird.y + bird.radius > p.y + this.h + this.gap) {
                    goToDyingState();
                }
            }
        }
    },

    reset: function() {
        this.position = [];
    }
};

function drawScore() {
    const scoreStr = score.toString();
    let totalWidth = 0;
    for(let char of scoreStr) {
        let index = parseInt(char);
        if(scoreImages[index].complete) {
            totalWidth += scoreImages[index].width;
        } else {
            totalWidth += 24;
        }
    }

    let currentX = (cvs.width - totalWidth) / 2;
    const yPos = 40;

    for(let char of scoreStr) {
        let index = parseInt(char);
        let img = scoreImages[index];
        ctx.drawImage(img, currentX, yPos);
        currentX += img.width + 1;
    }
}

// --- LOGIKA STANU I REKORDÓW ---

function goToDyingState() {
    state.current = state.dying;
    HIT_S.play();
    DIE_S.play();
}

function getScores() {
    let raw = localStorage.getItem("flappy_top5_obj");
    if (!raw) return [];
    try {
        let parsed = JSON.parse(raw);
        if(parsed.length > 0 && typeof parsed[0] !== 'object') return [];
        return parsed;
    } catch(e) {
        return [];
    }
}

function showGameOver() {
    // ZMIANA KLUCZOWA: Sprawdzamy, czy AKTUALNY wynik jest lepszy od STAREGO rekordu.
    // Animacja włącza się tylko, gdy pobijesz absolutny numer 1.
    if (score > bestScore) {
        state.current = state.spin; // Kręcenie ptakiem
        setTimeout(() => {
            // Po animacji ekran wpisywania
            document.getElementById("congrats-screen").classList.remove("hidden");
            document.getElementById("nick-input").focus();
            state.current = state.over;
        }, 3000);
    } else {
        // Jeśli nie pobito rekordu #1 (nawet jeśli wszedłeś do top 5),
        // po prostu zapisz wynik po cichu (jako Anonim/Gracz) i pokaż Game Over.
        autoSaveScoreIfTop5();
        displayGameOverUI();
    }
}

function autoSaveScoreIfTop5() {
    // Funkcja do cichego zapisu wyników Top 5 (miejsca 2-5)
    let scores = getScores();
    // Sprawdź, czy wynik łapie się na listę (jeśli lista pełna)
    if (scores.length < 5 || score > scores[scores.length - 1].score) {
        if(score > 0) {
            scores.push({ name: "Gracz", score: score });
            scores.sort((a, b) => b.score - a.score);
            scores = scores.slice(0, 5);
            localStorage.setItem("flappy_top5_obj", JSON.stringify(scores));
        }
    }
}

function saveHighScore() {
    const nickInput = document.getElementById("nick-input");
    let nick = nickInput.value.trim() || "Mistrz";

    let scores = getScores();
    scores.push({ name: nick, score: score });

    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 5);

    localStorage.setItem("flappy_top5_obj", JSON.stringify(scores));

    document.getElementById("congrats-screen").classList.add("hidden");
    displayGameOverUI();
}

function displayGameOverUI() {
    document.getElementById("game-over-screen").classList.remove("hidden");

    // Teraz aktualizujemy bestScore do wyświetlenia
    bestScore = Math.max(score, bestScore);
    localStorage.setItem("flappy_best_score_val", bestScore); // Zapisz nowy rekord liczbowo

    document.getElementById("current-score").innerText = score;
    document.getElementById("best-score").innerText = bestScore;
    updateTop5List();
}

function updateTop5List() {
    const list = document.getElementById("high-score-list");
    list.innerHTML = "";
    const scores = getScores();

    scores.forEach((s, index) => {
        const li = document.createElement("li");
        li.innerText = `#${index + 1} ${s.name}: ${s.score}`;
        list.appendChild(li);
    });
}

function resetGame() {
    bird.speed = 0;
    bird.rotation = 0;
    bird.y = 150;
    pipes.reset();
    score = 0;
    frames = 0;
    state.current = state.getReady;

    document.getElementById("game-over-screen").classList.add("hidden");
    document.getElementById("congrats-screen").classList.add("hidden");
    document.getElementById("nick-input").value = "";
}

// --- RYSOWANIE I PĘTLA ---

function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();

    if (state.current === state.getReady) {
        ctx.drawImage(getReadyImg, cvs.width/2 - getReadyImg.width/2, 100);
    }

    if (state.current === state.game || state.current === state.dying) {
        drawScore();
    }
}

function loop() {
    bird.update();
    fg.update();
    pipes.update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

// --- OBSŁUGA WEJŚCIA ---

document.addEventListener("keydown", function(evt) {
    if (evt.code === "Space") {
        if(document.activeElement === document.getElementById("nick-input")) return;
        action();
    }
});

cvs.addEventListener("click", function() {
    action();
});

document.getElementById("restart-btn").addEventListener("click", resetGame);
document.getElementById("save-score-btn").addEventListener("click", saveHighScore);

function action() {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            SWOOSH_S.play();
            break;
        case state.game:
            bird.flap();
            FLAP_S.play();
            break;
    }
}

loop();