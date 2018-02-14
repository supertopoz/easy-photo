const dataReducer = (state = {save: false}, action) =>{
  switch (action.type) {
    case 'UPDATE':
      return Object.assign({}, state, {
        data: action.data
      })
    case 'UPDATE_TAGS':
      const newState = state;
      newState.data[action.data.id].tags = action.data.text
      return Object.assign({}, state, {
         data: newState.data
      })
    case 'UPDATE_IMAGE_NAME':
      const newNameState = state;
      newNameState.data[action.data.id].name = action.data.text
      return Object.assign({}, state, {
         data: newNameState.data
      })
      case 'SAVE_CHANGES':
      return Object.assign({}, state, {
        saveChanges: action.saveChanges
      }) 
    default:
      return state
  }
 
}

const dataUpdate = Redux.createStore(dataReducer);
 
dataUpdate.subscribe(() => {
  const data = dataUpdate.getState().data 
  const saveChange = dataUpdate.getState().saveChanges;
  if (saveChange) updateFirebase(data)  
});

const updateData = (e) => ({type:'UPDATE', data: e.value})
const updateTags = (e) => ({type:'UPDATE_TAGS', data: e.value })
const updateImageName = (e) => ({type:'UPDATE_IMAGE_NAME', data: e.value })
const saveChanges = (e) => ({type:'SAVE_CHANGES', saveChanges: e.value})

const saveDataChanges = () => {
  dataUpdate.dispatch(saveChanges({value: true}))
  dataUpdate.dispatch(saveChanges({value: false}))
}

const updateFirebase = (data) => {
  console.log(data)
  firebase.database().ref('photos/').update(data);
}