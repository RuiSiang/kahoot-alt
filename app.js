"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __importDefault(require("events"));
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var app = express_1.default();
var http = http_1.createServer(app);
var io = require("socket.io")(http);
var timeUpEvent = new events_1.default.EventEmitter();
var questions = [
    {
        text: "In Spain, people eat 12 ____ right before midnight. One for each bell strike.",
        time: 5,
        answers: [
            "olives",
            "tapas",
            "grapes",
            "pieces of bread",
        ],
        correctAnswer: "grapes",
    },
    {
        text: "Which country has a giant hour glass wheel that needs to be turned on its head at midnight?",
        time: 10,
        answers: [
            "Hungary",
            "Romania",
            "Belgium",
            "Switzerland",
        ],
        correctAnswer: "Hungary",
    },
    {
        text: "In Belgium, kids prepare ______ in school for their grandparents and godparents.",
        time: 10,
        answers: [
            "small gifts",
            "party crowns and hats",
            "songs",
            "New Year's letters",
        ],
        correctAnswer: "New Year's letters",
    },
    {
        text: "Which country calls New Year's Eve Hogmanay?",
        time: 10,
        answers: [
            "Ireland",
            "Scotland",
            "Greenland",
            "England",
        ],
        correctAnswer: "Scotland",
    },
    {
        text: "People in Finland predict what'll happen in the new year by _______.",
        time: 10,
        answers: [
            "reading tea leaves",
            "reading palms",
            "casting molten tin into water and interpreting the shape",
            "visiting fortune tellers",
        ],
        correctAnswer: "casting molten tin into water and interpreting the shape",
    },
    {
        text: "What is baked into sweets as a good luck token in Bolivia?",
        time: 10,
        answers: [
            "Pomegranate seeds",
            "Grapes",
            "Almonds",
            "Coins",
        ],
        correctAnswer: "Coins",
    },
    {
        text: "In which city in the U.S. do millions of people gather to watch the ball drop at midnight?",
        time: 10,
        answers: [
            "New York City, NY",
            "Washington, D.C.",
            "Austin, TX",
            "Dallas, TX",
        ],
        correctAnswer: "New York City, NY",
    },
    {
        text: "In Russia, people write down wishes on paper. What do they do with them afterwards?",
        time: 10,
        answers: [
            "Put them in a jar and keep it closed for a year.",
            "Burn them, throw it in a Champagne glass and drink it.",
            "Burn them in the fire place.",
            "Tie them to balloons and let them fly away.",
        ],
        correctAnswer: "Burn them, throw it in a Champagne glass and drink it.",
    },
    {
        text: "People in Colombia believe that _____ will increase their chances to travel in the new year.",
        time: 10,
        answers: [
            "packing their suitcases by midnight",
            "making a wish on their passports",
            "buying a new suitcase by midnight",
            "running around the block with their suitcases",
        ],
        correctAnswer: "running around the block with their suitcases",
    },
    {
        text: "Why do Ecuadorians burn homemade puppets at midnight?",
        time: 10,
        answers: [
            "It's a replacement for fireworks, as those are illegal.",
            "To burn away the old year and start with a clean slate.",
            "They believe puppets are evil.",
            "To protect themselves against spirits.",
        ],
        correctAnswer: "To burn away the old year and start with a clean slate.",
    },
];
/**
 * SOCKETID: ["<PLAYERNAME>", POINTS]
 * Example --
 * dfwaogruhdslfsdljf: ["Khushraj", 0]
 */
var userPointsMap = {};
io.on("connection", function (socket) {
    var attempt = "";
    console.log("A user connected");
    socket.emit("connected");
    socket.once("name", function (name) {
        userPointsMap[socket.id] = [name, 0];
        io.emit("name", name);
    });
    socket.once("start", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _loop_1, _i, questions_1, question, sortedValues;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _loop_1 = function (question) {
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
                                        var toSend;
                                        return __generator(this, function (_a) {
                                            toSend = __assign({}, question);
                                            setTimeout(function () {
                                                timeUpEvent.emit("timeUp", question.correctAnswer);
                                                var sortedValues = Object.values(userPointsMap).sort(function (_a, _b) {
                                                    var a = _a[1];
                                                    var b = _b[1];
                                                    return b - a;
                                                });
                                                var top5 = sortedValues.slice(0, 5);
                                                io.emit("timeUp", top5);
                                                socket.once("next", function () {
                                                    resolve();
                                                });
                                            }, question.time * 1000);
                                            delete toSend.correctAnswer;
                                            io.emit("question", toSend);
                                            return [2 /*return*/];
                                        });
                                    }); })];
                                case 1:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, questions_1 = questions;
                    _a.label = 1;
                case 1:
                    if (!(_i < questions_1.length)) return [3 /*break*/, 4];
                    question = questions_1[_i];
                    return [5 /*yield**/, _loop_1(question)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    sortedValues = Object.values(userPointsMap).sort(function (_a, _b) {
                        var a = _a[1];
                        var b = _b[1];
                        return b - a;
                    });
                    io.emit("gameover", sortedValues);
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on("answer", function (answer) {
        attempt = answer;
    });
    timeUpEvent.on("timeUp", function (correctAnswer) {
        if (attempt) {
            if (attempt === correctAnswer) {
                userPointsMap[socket.id][1]++;
                socket.emit("correct");
            }
            else {
                socket.emit("incorrect");
            }
            attempt = "";
        }
        else {
            socket.emit("noAnswer");
        }
    });
});
app.use(express_1.default.static("public"));
http.listen(3000, function () {
    console.log("listening on *:3000");
});
