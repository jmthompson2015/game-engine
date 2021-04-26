const Selector = {};

Selector.currentRound = (state) => state.currentRound;

Selector.currentPhaseKey = (state) => state.currentPhaseKey;

Selector.currentPlayerId = (state) => state.currentPlayerId;

Selector.currentPlayerOrder = (state) => state.currentPlayerOrder;

Selector.currentStepKey = (state) => state.currentStepKey;

Object.freeze(Selector);

export default Selector;
