export default function renderScreen(screen, game, requestAnimationFrame){
        const context = screen.getContext('2d')

        context.clearRect(0, 0, 10, 10)

        for (const playerId in game.state.players){
            const player = game.state.players[playerId]
            context.fillStyle = 'black'
            context.fillRect(player.x, player.y, 1, 1)
        }

        for (const coinId in game.state.coins){
            const coin = game.state.coins[coinId]
            context.fillStyle = 'yellow'
            context.fillRect(coin.x, coin.y, 1, 1)
        }

        requestAnimationFrame(() => {
            renderScreen(screen, game, requestAnimationFrame)
        })
    }