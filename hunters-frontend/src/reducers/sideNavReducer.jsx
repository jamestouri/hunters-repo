function changeSelection(action, givenArray, currentState, changedKey) {
  if (givenArray.includes(action)) {
    const changedArray = givenArray.filter((time) => time !== action);
    return { ...currentState, [changedKey]: changedArray };
  } else {
    givenArray.push(action);
    return { ...currentState, [changedKey]: givenArray };
  }
}

export default function sideNavReducer(state, action) {
  switch (action.type) {
    case 'hours':
    case 'days':
    case 'weeks':
    case 'months':
      return changeSelection(action.type, state.timeCommitment, state, 'timeCommitment');
    case 'beginner':
    case 'intermediate':
    case 'advanced':
      return changeSelection(action.type, state.experienceLevel, state, 'experienceLevel');
    case 'open':
    case 'bountyAssigned':
    case 'workSubmitted':
    case 'done':
    case 'expired':
    case 'cancelled':
      return changeSelection(action.type, state.statusBar, state, 'statusBar');
    default:
      return state;
  }
}
