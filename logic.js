document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', function() {
        // Убираем активный класс у всех вкладок и кнопок
        document.querySelectorAll('.tab-link, .tab-content').forEach(el => {
            el.classList.remove('active');
        });

        // Добавляем активный класс текущей вкладке и кнопке
        this.classList.add('active');
        const tabId = this.dataset.tab;
        document.getElementById(tabId).classList.add('active');
    });
});
document.getElementById('generateBtn').addEventListener('click', function() {
    const min = parseInt(document.getElementById('min').value) || 0;
    const max = parseInt(document.getElementById('max').value) || 100;

    // Проверка и корректировка диапазона
    const [correctMin, correctMax] = [Math.min(min, max), Math.max(min, max)];

    // Генерация числа
    const result = Math.floor(Math.random() * (correctMax - correctMin + 1)) + correctMin;

    // Анимация результата
    const resultBox = document.getElementById('result');
    resultBox.textContent = result;
});
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

    const flipCoin = (coin, duration) => {
        let currentRotation = 0;
        let targetRotation = 1440; // 4 полных оборота
        const startTime = performance.now();
        let isFlipping = true;

        // Начальная сторона
        let isHeads = Math.random() < 0.5;
        coin.src = isHeads ? 'Орёл.png' : 'Решка.png';

        const animate = (timestamp) => {
            if (!isFlipping) return;

            const progress = (timestamp - startTime) / duration;
            currentRotation = progress * targetRotation;

            // Меняем сторону при каждом повороте на 180 градусов
            if (Math.floor(currentRotation / 180) % 2 === 0) {
                coin.style.transform = `translate(-50%, -50%) rotateY(${currentRotation}deg)`;
            } else {
                coin.style.transform = `translate(-50%, -50%) rotateY(${currentRotation - 180}deg)`;
                coin.src = isHeads ? 'Решка.png' : 'Орёл.png';
                isHeads = !isHeads;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Фиксируем конечный результат
                const finalSide = Math.random() < 0.5 ? 'Орёл.png' : 'Решка.png';
                coin.src = finalSide;
                coin.style.transform = 'translate(-50%, -50%) rotateY(0deg)';
                isFlipping = false;
                completedFlips++;

                if (completedFlips === count) {
                    document.getElementById('genr').disabled = false;
                }
            }
        };

        requestAnimationFrame(animate);
    };

    let completedFlips = 0;
    const coins = count === 1
        ? [document.getElementById('mainCoin')]
        : document.querySelectorAll('.small-coin');

    coins.forEach(coin => {
        flipCoin(coin, 1200 + Math.random() * 300);
    });
});
const wheel = {
    options: [],
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'],
    ctx: null,
    canvas: null,
    spinning: false,
    currentRotation: 0
};

function initWheel() {
    wheel.canvas = document.getElementById('wheelCanvas');
    wheel.ctx = wheel.canvas.getContext('2d');
    drawWheel();
}

function drawWheel() {
    const ctx = wheel.ctx;
    const canvas = wheel.canvas;
    const center = canvas.width / 2;
    const radius = canvas.width / 2 - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка основного колеса
    if (wheel.options.length === 0) {
        ctx.fillStyle = 'rgba(153, 255, 42, 0.1)';
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.fill();
    } else {
        const sliceAngle = (Math.PI * 2) / wheel.options.length;
        wheel.options.forEach((option, index) => {
            ctx.fillStyle = wheel.colors[index % wheel.colors.length];
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, index * sliceAngle, (index + 1) * sliceAngle);
            ctx.fill();

            // Отрисовка текста
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(index * sliceAngle + sliceAngle / 2);
            ctx.fillStyle = '#000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(option.text, radius - 20, 5);
            ctx.restore();
        });
    }

    // Добавляем центральный кружок
    ctx.fillStyle = '#FFFFFF'; // Белый цвет
    ctx.beginPath();
    ctx.arc(center, center, 15, 0, Math.PI * 2); // Радиус 15px
    ctx.fill();

    // Обводка для кружка
    ctx.lineWidth = 2;
    ctx.stroke();
}

document.getElementById('addOption').addEventListener('click', () => {
    const input = document.getElementById('wheelOption');
    const text = input.value.trim();

    if(text) {
        wheel.options.push({ text, weight: 1 });
        input.value = '';
        updateOptionsList();
        drawWheel();
    }
});

function updateOptionsList() {
    const list = document.getElementById('optionsList');
    list.innerHTML = wheel.options.map((option, index) => `
        <div class="option-item">
            ${option.text}
            <button class="butX" onclick="removeOption(${index})">×</button>
        </div>
    `).join('');
}

function removeOption(index) {
    wheel.options.splice(index, 1);
    updateOptionsList();
    drawWheel();
}

document.getElementById('spinBtn').addEventListener('click', function() {
    if(wheel.spinning || wheel.options.length < 2) return;

    wheel.spinning = true;
    this.disabled = true;
    document.getElementById('wheelResult').textContent = '';

    // Параметры анимации
    const spins = 5; // Фиксированное число оборотов для теста
    const duration = 3000;
    const winnerIndex = Math.floor(Math.random() * wheel.options.length);

    // Рассчет углов
    const sliceAngle = (Math.PI * 2) / wheel.options.length;
    const winnerCenterAngle = winnerIndex * sliceAngle + sliceAngle/2;

    // Угол стрелки (верхняя позиция)
    const arrowAngle = -Math.PI/2;

    // Требуемый конечный угол вращения
    const targetRotation = arrowAngle - winnerCenterAngle + Math.PI*2*spins;

    // Нормализация текущего вращения
    wheel.currentRotation %= Math.PI*2;

    const startRotation = wheel.currentRotation;
    const rotationDelta = targetRotation - startRotation;
    const startTime = Date.now();

    const animate = () => {
        if(!wheel.spinning) return;

        const progress = Math.min(1, (Date.now() - startTime) / duration);
        const easedProgress = 1 - Math.pow(1 - progress, 4); // Сильное замедление в конце

        wheel.currentRotation = startRotation + rotationDelta * easedProgress;

        // Отрисовка с учетом вращения
        wheel.ctx.clearRect(0, 0, wheel.canvas.width, wheel.canvas.height);
        wheel.ctx.save();
        wheel.ctx.translate(wheel.canvas.width/2, wheel.canvas.height/2);
        wheel.ctx.rotate(wheel.currentRotation);
        wheel.ctx.translate(-wheel.canvas.width/2, -wheel.canvas.height/2);
        drawWheel();
        wheel.ctx.restore();

        if(progress < 1) {
            requestAnimationFrame(animate);
        } else {
            wheel.spinning = false;
            this.disabled = false;
            document.getElementById('wheelResult').textContent =
                `Результат: ${wheel.options[winnerIndex].text}`;

            // Автоматическая нормализация угла
            wheel.currentRotation %= (Math.PI*2);
        }
    };

    requestAnimationFrame(animate);
});
document.getElementById('generateRandomWord').addEventListener('click', function() {
    const input = document.getElementById('wordsInput').value;
    const words = input
        .split('\n') // Разделение по переносу строк
        .map(word => word.trim())
        .filter(word => word.length > 0);

    if(words.length === 0) {
        showError('Введите хотя бы один вариант!');
        return;
    }

    const randomIndex = Math.floor(Math.random() * words.length);
    const resultElement = document.getElementById('wordResult');

    // Анимация выбора
    let count = 0;
    const animation = setInterval(() => {
        resultElement.textContent = words[Math.floor(Math.random() * words.length)];
        count++;
        if(count > 15) clearInterval(animation);
    }, 80);

    // Показать окончательный результат
    setTimeout(() => {
        resultElement.textContent = words[randomIndex];
        resultElement.style.color = '#99ff2a';
        resultElement.classList.add('highlight');
        setTimeout(() => resultElement.classList.remove('highlight'), 1000);
    }, 1300);
});

function showError(message) {
    const resultBox = document.getElementById('wordResult');
    resultBox.textContent = message;
    resultBox.style.color = '#ff6b6b';
    setTimeout(() => {
        resultBox.textContent = '';
        resultBox.style.color = '';
    }, 2000);
}
// Инициализация колеса при загрузке
initWheel();
updateCoinsLayout(1)

