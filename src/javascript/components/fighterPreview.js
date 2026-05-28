import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // todo: show fighter info (image, name, health, etc.)

    if (fighter) {
        const { name, source } = fighter;
        const nameElement = createElement({
            tagName: 'h2',
            className: 'fighter-preview__name'
        });
        nameElement.innerHTML = `${name}`;
        const infoElement = createElement({
            tagName: 'div',
            className: 'fighter-preview___info'
        });

        const fighterStats = ['health', 'attack', 'defense'];

        Object.entries(fighter).map(prop => {
            const [key, value] = prop;
            if (fighterStats.includes(key)) {
                const data = createElement({
                    tagName: 'p',
                    className: 'fighter-preview__prop'
                });
                data.innerHTML = `${key}: ${value}`;
                infoElement.appendChild(data);
            }
            return null;
        });

        const imgElement = createFighterImage({ name, source });
        fighterElement.appendChild(nameElement);
        fighterElement.appendChild(imgElement);
        fighterElement.appendChild(infoElement);
    }

    return fighterElement;
}
