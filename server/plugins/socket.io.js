import {Server} from 'socket.io';


export default defineNitroPlugin((nitroApp) => {
    const nuxtConfig = useRuntimeConfig();
    const url = nuxtConfig.public.socketPort;
    const io = new Server(3001, {
        serveClient: false,
        cors: {
            origin: '*',
        }
    });

    console.log('Socket listen')
    io.engine.on("connection_error", (err) => {
        console.log("socket.io connection error", err)
    })

    io.on('connection', (socket) => {
        console.log('Connection server', socket.id)
    })


    const currentQuestion = async (socket) => {
        let current = 0;
        (await io.in(socket.quizId).fetchSockets()).forEach((s) => {
            if (s.admin) {
                current = s.currentQuestion
            }
        })
        return current;
    };
    const getPlayers = async (socket) => {
        let playersDatas = [];
        (await io.in(socket.quizId).fetchSockets()).forEach((s) => {
            if (s.name !== null && s.name !== undefined) {
                playersDatas.push({
                    name: s.name,
                    email: s.email,
                    currentQuestion: s.currentQuestion,
                    quiz: s.quiz
                })
            }
        })
        io.to(socket.quizId).emit('playersData', playersDatas)
        return playersDatas;
    }

    const allPlayersAndwered = async (socket) => {
        let all = true;
        (await io.in(socket.quizId).fetchSockets()).forEach((s) => {
            if (!s.admin) {
                if (s.quiz === undefined || s.quiz === null || !s.quiz.questions[socket.currentQuestion].validated) {
                    all = false
                }
            }
        })
        if (all) {
            io.to(socket.quizId).emit('waintingPlayers', {
                message: ``,
                wait: false
            })
            io.to(socket.quizId).emit('allPlayersAnswered', {currentQuestion: socket.currentQuestion})
        } else {
            io.to(socket.quizId).emit('waintingPlayers', {
                message: `En attente des autres participants ...`,
                wait: true
            })
        }
    }

    io.on('disconnect', async (socket) => {
        await getPlayers(socket)
        await allPlayersAndwered(socket);
    })


    io.on('connect', async (socket) => {
        socket.emit('message', `welcome ${socket.id}`)

        socket.broadcast.emit('message', `${socket.id} joined`)

        socket.on('message', function message(data) {
            socket.emit('message', {data})
        })
        socket.on('disconnecting', async () => {
            await getPlayers(socket)
            socket.broadcast.emit('message', `${socket.id} left`)
        })

        // Players
        socket.on('connectedToQuiz', async function msg(data) {
            socket.quizId = data.quizId
            socket.quiz = data.quiz
            socket.currentQuestion = data.currentQuestion
            socket.name = data.name
            socket.email = data.email
            socket.join(data.quizId)
            await getPlayers(socket)
            socket.emit('currentQuestion', {currentQuestion: await currentQuestion(socket)})
        })
        socket.on('answer', async function msg(data) {
            socket.quiz = data.quiz
            socket.quiz.questions[socket.currentQuestion].validated = true
            socket.emit('answered', {
                quiz: socket.quiz
            })

            // Check if all players answered
            await getPlayers(socket)
            await allPlayersAndwered(socket);

        })

        socket.on('nextQuestion', async function msg(data) {
            socket.currentQuestion = data.currentQuestion;
            (await io.in(socket.quizId).fetchSockets()).forEach((s) => {
                s.currentQuestion = data.currentQuestion
                s.emit('nextQuestion', {currentQuestion: socket.currentQuestion})
            })

        })

        // Admin
        socket.on('adminConnectedTo', async function msg(data) {
            socket.quizId = data.quizId
            socket.currentQuestion = data.currentQuestion
            socket.admin = true
            socket.join(data.quizId)
            const all = await getPlayers(socket)
            // Get min currentQuestion
            let min = 0;
            all.forEach((p) => {
                if (p.currentQuestion < min || min === 0) {
                    min = p.currentQuestion
                }
            })
            socket.currentQuestion = min
            socket.emit('currentQuestion', {currentQuestion: min})
            await allPlayersAndwered(socket);
        })

        socket.on('quizSummary', async function msg(data) {
            const playersDatas = await getPlayers(socket)
            socket.emit('quizSummaryResults', {
                players: playersDatas,
                quizId: socket.quizId
            })
        })
    })
})