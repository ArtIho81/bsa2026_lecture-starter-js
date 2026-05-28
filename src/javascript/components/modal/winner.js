import showModal from './modal';
import createElement from '../../helpers/domHelper';

export default function showWinnerModal(fighter) {
    // call showModal function
    const bodyElement = createElement({
        tagName: 'h1',
        className: 'winner'
    });
    bodyElement.innerHTML = `${fighter?.name}`;
    showModal({
        title: 'winner',
        bodyElement
    });
}
