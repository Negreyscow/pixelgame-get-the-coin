export default function createKeyboardListener(document){

    //observer pattern
    const state = {
        observers: [] //lista dos observers
    }

    function registerPlayerId(playerId){
        state.playerId = playerId
    }
    
    function subscribe(observerFunction){ //registrar observer dentro de um subject
        state.observers.push(observerFunction)
    }

    function notifyAll(command){
        console.log(`Notifying ${state.observers.length} observers`)
        for (const observerFunction of state.observers){
            observerFunction(command)
        }
    }

    document.addEventListener('keydown', handleKeyDown)

    function handleKeyDown(event){
        const keyPressed = event.key

        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed
        } 
        
        notifyAll(command)
    }

    return {
        subscribe,
        registerPlayerId 
    }

}