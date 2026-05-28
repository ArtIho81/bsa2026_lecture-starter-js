import controls from '../../constants/controls';

function getRandomBetweenOneAndTwo() {
    return Math.random() + 1;
}

function getCriticalHitDamage(fighter) {
    return 2 * fighter.attack;
}

export function getHitPower(fighter) {
    const criticalHitChance = getRandomBetweenOneAndTwo();
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = getRandomBetweenOneAndTwo();
    return fighter.defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    return Math.max(getHitPower(attacker) - getBlockPower(defender), 0);
}

function createPlayer(fighter, player, healthIndicatorId) {
    return {
        fighter,
        controls: {
            attack: controls[`${player}Attack`],
            block: controls[`${player}Block`],
            criticalHit: controls[`${player}CriticalHitCombination`]
        },
        health: fighter.health,
        block: false,
        criticalHit: new Set(),
        criticalHitTime: 0,
        healthIndicator: document.getElementById(healthIndicatorId),
        setHealth(health) {
            this.health = health;
            this.healthIndicator.style.width = `${(health / this.fighter.health) * 100}%`;
        },
        setCriticalHitTime(time) {
            this.criticalHitTime = time;
        }
    };
}

export async function fight(firstFighter, secondFighter) {
    const playerOne = createPlayer(firstFighter, 'PlayerOne', 'left-fighter-indicator');
    const playerTwo = createPlayer(secondFighter, 'PlayerTwo', 'right-fighter-indicator');
    const criticalHitInterval = 10 * 1000;

    const isCriticalHitAvaible = player => {
        if (player.controls.criticalHit.every(key => player.criticalHit.has(key))) {
            return Date.now() - player.criticalHitTime >= criticalHitInterval;
        }
        return false;
    };

    function isKeyAction(e) {
        if (e.type === 'keyup' || e.type === 'keydown') {
            return true;
        }
        return false;
    }

    return new Promise(resolve => {
        function setFighterBlock(e) {
            if (!isKeyAction(e)) {
                return;
            }
            if (e.code === controls.PlayerOneBlock) {
                playerOne.block = e.type === 'keydown';
            }
            if (e.code === controls.PlayerTwoBlock) {
                playerTwo.block = e.type === 'keydown';
            }
        }

        function setCriticalHit(e, player) {
            if (!isKeyAction(e)) {
                return;
            }

            player.controls.criticalHit.forEach(btn => {
                if (e.code !== btn) {
                    return;
                }
                if (e.type === 'keydown') {
                    player.criticalHit.add(btn);
                } else {
                    player.criticalHit.delete(btn);
                }
            });
        }

        document.addEventListener('keyup', e => {
            setFighterBlock(e);
            setCriticalHit(e, playerOne);
            setCriticalHit(e, playerTwo);
        });

        document.addEventListener('keydown', e => {
            setFighterBlock(e);
            setCriticalHit(e, playerOne);
            setCriticalHit(e, playerTwo);

            function hit(attacker, defender) {
                if (!attacker.block && e.code === attacker.controls.attack) {
                    const demage = getDamage(attacker.fighter, defender.fighter);
                    defender.setHealth(defender.health - demage);
                }
            }

            function criticalHit(attacker, defender) {
                if (isCriticalHitAvaible(attacker)) {
                    const demage = getCriticalHitDamage(attacker.fighter);
                    defender.setHealth(defender.health - demage);
                    attacker.setCriticalHitTime(Date.now());
                }
            }
            hit(playerOne, playerTwo);
            hit(playerTwo, playerOne);
            criticalHit(playerOne, playerTwo);
            criticalHit(playerTwo, playerOne);

            if (playerOne.health <= 0) resolve(secondFighter);
            if (playerTwo.health <= 0) resolve(firstFighter);
        });
    });
}
