export default function createGame(){ 

    const state = {
        players: {},
        coins: {},
        screen: {
            height: 10,
            width: 10
        }
    }

    const observers = []

    function subscribe(observerFunction){ //registrar observer dentro de um subject
        observers.push(observerFunction)
    }

    function notifyAll(command){
        console.log(`Notifying ${state.observers.length} observers`)
        for (const observerFunction of state.observers){
            observerFunction(command)
        }
    }

    function setState(newState){
        Object.assign(state, newState)
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

    function addCoin(command){
        const coinId = command.coinId
        const coinX = command.coinX
        const coinY = command.coinY

        state.coins[coinId] = {
            x: coinX,
            y: coinY
        }
    }

    function removeCoin(command){
        const coinId = command.coinId
        delete state.coins[coinId]
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
        subscribe
    }
}