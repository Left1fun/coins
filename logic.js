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
    const count = parseInt(document.getElementById('coinCount').value);
    const attempts = document.getElementById('gpp');
    attempts.textContent = parseInt(attempts.textContent) + 1;

    this.disabled = true;

    const mainCoin = document.getElementById('mainCoin');
    const smallCoins = document.querySelectorAll('.small-coin');

    // Генерируем случайное количество переворотов для каждой монеты
    const flips = Array.from({ length: count }, () => Math.floor(Math.random() * 20) + 5); // от 5 до 24 переворотов
    let completedFlips = 0;

    // Функция для переворота монеты
    const flipCoin = (coin, flipCount, index) => {
        let currentSide = coin.src.includes('Орёл.png') ? 'Орёл.png' : 'Решка.png';
        let flipsRemaining = flipCount;

        // Генерируем случайную скорость для переворота (например, от 100 до 500 мс)
        const randomSpeed = Math.floor(Math.random() * 400) + 100; // скорость от 100 до 500 мс

        const flipInterval = setInterval(() => {
            currentSide = currentSide === 'Орёл.png' ? 'Решка.png' : 'Орёл.png';
            coin.src = currentSide;

            flipsRemaining--;

            if (flipsRemaining === 0) {
                clearInterval(flipInterval);
                const finalSide = Math.random() < 0.5 ? 'Орёл.png' : 'Решка.png';
                coin.src = finalSide;

                completedFlips++;

                // Включаем кнопку снова после завершения всех переворотов
                if (completedFlips === count) {
                    document.getElementById('genr').disabled = false;
                }
            }
        }, randomSpeed);
    };

    // Запускаем перевороты для каждой монеты
    if (count === 1) {
        flipCoin(mainCoin, flips[0], 0);
    } else {
        smallCoins.forEach((coin, index) => {
            flipCoin(coin, flips[index], index);
        });
    }
})


updateCoinsLayout(1)

