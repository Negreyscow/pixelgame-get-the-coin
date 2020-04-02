export default function createGame(){ 

    const state = {
        players: {},
        coins: {},
        screen: {
            height: 10,
            width: 10
        },
    }

    const observers = []

    function start() {
        const frequency = 2000

        setInterval(addCoin, frequency)
    }

    function subscribe(observerFunction){ //registrar observer dentro de um subject
        observers.push(observerFunction)
    }

    function notifyAll(command){
        for (const observerFunction of observers){
            observerFunction(command)
        }
    }

    function setState(newState){
        Object.assign(state, newState)
    }

    function addCoin(command) {
        const coinId = command ? command.coinId : Math.floor(Math.random() * 100000000)
        const coinX = command ? command.coinX : Math.floor(Math.random() * state.screen.width)
        const coinY = command ? command.coinY : Math.floor(Math.random() * state.screen.height)

        state.coins[coinId] = {
            x: coinX,
            y: coinY
        }

        notifyAll({
            type: 'add-coin',
            coinId: coinId,
            coinX: coinX,
            coinY: coinY
        })
    }

    function addPlayer(command){
        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })

    }

    function removePlayer(command){
        const playerId = command.playerId
        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
    }

    function removeCoin(command){
        const coinId = command.coinId
        delete state.coins[coinId]

        notifyAll({
            type: 'remove-coin',
            coinId: coinId
        })
    }

    //factory pattern
    function movePlayer(command){
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player){
                if (player.y - 1 >= 0){
                    player.y = player.y  - 1
                }
            },
            ArrowRight(player){
                if (player.x + 1 < state.screen.width){
                    player.x = player.x + 1
                }
            },
            ArrowDown(player){
                if (player.y + 1 < state.screen.height){
                    player.y = player.y + 1
                }
            },
            ArrowLeft(player){
                if (player.x - 1 >= 0){
                    player.x = player.x - 1
                }
            }
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[command.playerId]
        const moveFunction = acceptedMoves[keyPressed]
        
        if (player && moveFunction){
            moveFunction(player)
            checkCoinForCollision(playerId)
        }

    }

    function checkCoinForCollision(playerId){
        const player = state.players[playerId]

        for (const coinId in state.coins){
            const coin = state.coins[coinId]
            
            if (player.x == coin.x && player.y == coin.y)
                removeCoin({ coinId: coinId })
        }
    }
    

    return {
        addPlayer,
        removePlayer,
        addCoin,
        removeCoin,
        movePlayer,
        setState,
        state,
        subscribe,
        start
    }
}