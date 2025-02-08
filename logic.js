function updateCoinsLayout(count) {
    const mainCoin = document.getElementById('mainCoin')
    const smallCoins = document.getElementById('smallCoins')

    if (!mainCoin || !smallCoins) {
        console.error('Элементы mainCoin или smallCoins не найдены')
        return
    }

    smallCoins.innerHTML = ''

    if (count === 1) {
        mainCoin.style.display = 'block'
        mainCoin.style.width = '300px'
        smallCoins.style.display = 'none'
    } else {
        mainCoin.style.display = 'none'
        smallCoins.style.display = 'block'

        const baseSize = 100;
        const coinSize = Math.min(baseSize * (5 / count), 170)

        const positions = getPositions(count)
        for (let i = 0; i < count; i++) {
            const coin = document.createElement('img')
            coin.src = 'Решка.png'
            coin.alt = 'Монета'
            coin.className = 'small-coin'
            coin.style.width = `${coinSize}px`
            coin.style.height = 'auto'
            coin.style.position = 'absolute'
            coin.style.top = positions[i].top
            coin.style.left = positions[i].left
            coin.style.transform = 'translate(-50%, -50%)'
            smallCoins.appendChild(coin)
        }
    }
}

function getPositions(count) {
    switch (count) {
        case 2:
            return [
                { top: '50%', left: '20%' },
                { top: '50%', left: '80%' }
            ];
        case 3:
            return [
                { top: '20%', left: '50%' },
                { top: '80%', left: '20%' },
                { top: '80%', left: '80%' }
            ];
        case 4:
            return [
                { top: '20%', left: '20%' },
                { top: '20%', left: '80%' },
                { top: '80%', left: '20%' },
                { top: '80%', left: '80%' }
            ];
        case 5:
            return [
                { top: '50%', left: '50%' },
                { top: '20%', left: '20%' },
                { top: '20%', left: '80%' },
                { top: '80%', left: '20%' },
                { top: '80%', left: '80%' }
            ];
        default:
            return []
    }
}

document.getElementById('coinCount').addEventListener('change', function () {
    const count = parseInt(this.value)
    updateCoinsLayout(count)

    if (count === 1) {
        document.getElementById('mainCoin').src = 'Решка.png'
    } else {
        document.querySelectorAll('.small-coin').forEach(coin => {
            coin.src = 'Решка.png'
        })
    }
})

document.getElementById('genr').addEventListener('click', function () {
    const count = parseInt(document.getElementById('coinCount').value)
    const attempts = document.getElementById('gpp')
    attempts.textContent = parseInt(attempts.textContent) + 1

    this.disabled = true

    const mainCoin = document.getElementById('mainCoin')
    const smallCoins = document.querySelectorAll('.small-coin')

    const flips = Array.from({ length: count }, () => Math.floor(Math.random() * 20) + 5)
    let completedFlips = 0;

    const flipCoin = (coin, flipCount, index) => {
        let currentSide = coin.src.includes('Орёл.png') ? 'Орёл.png' : 'Решка.png';
        let flipsRemaining = flipCount;

        const randomSpeed = Math.floor(Math.random() * 350) + 50

        const flipInterval = setInterval(() => {
            currentSide = currentSide === 'Орёл.png' ? 'Решка.png' : 'Орёл.png'

            if (index === 0) {
                mainCoin.src = currentSide
            } else {
                let currentSide1 = currentSide === 'Орёл.png' ? 'Решка.png' : 'Орёл.png'
                let currentSide2 = currentSide === 'Орёл.png' ? 'Решка.png' : 'Орёл.png'
                smallCoins[index - 1].src = currentSide1
                smallCoins[index].src = currentSide2
            }

            flipsRemaining--

            if (flipsRemaining === 0) {
                clearInterval(flipInterval)
                const finalSide = Math.random() < 0.5 ? 'Орёл.png' : 'Решка.png'
                
                if (index === 0) {
                    mainCoin.src = finalSide
                } else {
                    const finalSide1 = Math.random() < 0.5 ? 'Орёл.png' : 'Решка.png'
                    const finalSide2 = Math.random() < 0.5 ? 'Орёл.png' : 'Решка.png'
                    smallCoins[index - 1].src = finalSide1
                    smallCoins[index].src = finalSide2
                }

                completedFlips++;

                if (completedFlips === count) {
                    document.getElementById('genr').disabled = false
                }
            }
        }, randomSpeed + (index * 50))
    }

    for (let i = 0; i < count; i++) {
        flipCoin(i === 0 ? mainCoin : smallCoins[i - 1], flips[i], i);
    }
})


updateCoinsLayout(1)

