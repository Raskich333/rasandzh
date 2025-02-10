const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const joystick = document.getElementById('joystick');
const attackBtn = document.getElementById('attackBtn');

// Персонажи
const characters = {
    Raskich: { x: 100, y: 300, width: 50, height: 100, health: 100, name: 'Raskich' },
    Zhanna: { x: 500, y: 300, width: 50, height: 100, name: 'Zhanna' },
    Dragon: { x: 800, y: 200, width: 100, height: 150, health: 5, name: 'Dragon' },
    Skeletons: [
        { x: 400, y: 300, width: 40, height: 80, health: 2, name: 'Skeleton 1' },
        { x: 600, y: 300, width: 40, height: 80, health: 2, name: 'Skeleton 2' },
        { x: 700, y: 300, width: 40, height: 80, health: 2, name: 'Skeleton 3' }
    ]
};

let currentSkeletons = [characters.Skeletons[0]];
let gameState = 'intro'; // intro, gameplay, final

// Анимация в начале
function introAnimation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillText('Dragon утаскивает Zhanna!', 100, 100);
    setTimeout(() => {
        gameState = 'gameplay';
    }, 3000);
}

// Игровой процесс
function gameplay() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем персонажей
    drawCharacter(characters.Raskich);
    drawCharacter(characters.Zhanna);
    currentSkeletons.forEach(skeleton => drawCharacter(skeleton));
    if (currentSkeletons.length === 0) {
        drawCharacter(characters.Dragon);
    }

    // Управление Raskich
    joystick.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const rect = joystick.getBoundingClientRect();
        const dx = touch.clientX - rect.left - 50;
        const dy = touch.clientY - rect.top - 50;
        characters.Raskich.x += dx * 0.1;
        characters.Raskich.y += dy * 0.1;
    });

    // Атака
    attackBtn.addEventListener('click', () => {
        currentSkeletons.forEach((skeleton, index) => {
            if (Math.abs(characters.Raskich.x - skeleton.x) < 50) {
                skeleton.health--;
                if (skeleton.health <= 0) {
                    currentSkeletons.splice(index, 1);
                    if (currentSkeletons.length === 0 && characters.Skeletons.length > 1) {
                        currentSkeletons = characters.Skeletons.slice(1);
                    }
                }
            }
        });
    });

    // Проверка победы
    if (currentSkeletons.length === 0 && characters.Dragon.health <= 0) {
        gameState = 'final';
    }
}

// Финальная анимация
function finalAnimation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillText('Raskich дарит Zhanna букет цветов!', 100, 100);
    ctx.fillText('Давай сходим куда-нибудь вдвоем!', 100, 150);
}

// Основной цикл игры
function gameLoop() {
    if (gameState === 'intro') {
        introAnimation();
    } else if (gameState === 'gameplay') {
        gameplay();
    } else if (gameState === 'final') {
        finalAnimation();
    }
    requestAnimationFrame(gameLoop);
}

// Запуск игры
gameLoop();

// Рисуем персонажа
function drawCharacter(character) {
    ctx.fillStyle = 'gray';
    ctx.fillRect(character.x, character.y, character.width, character.height);
    ctx.fillStyle = 'white';
    ctx.fillText(character.name, character.x, character.y - 10);
}