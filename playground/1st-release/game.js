export default function createGame(){ 

    const state = {
        players: {},
        coins: {},
        screen: {
            height: 10,
            width: 10
        }
    }

    function addPlayer(command){
        const playerId = command.playerId
        const playerX = command.playerX
        const playerY = command.playerY

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }
    }

    function removePlayer(command){
        const playerId = command.playerId
        delete state.players[playerId]
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
        console.log(`Moving ${command.playerId} with ${command.keyPressed}`)

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
        state
    }
}