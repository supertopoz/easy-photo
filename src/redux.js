// Reducer - takes the action types and reduces them into a new state condition.
const reducer = (state = {save: false}, action) =>{

  switch (action.type) {
    case 'UPLOAD':
      return Object.assign({}, state, {
        upload: action.upload
      })
    case 'ADD_IMAGE':
      return Object.assign({}, state, {
        image: action.image
      }) 
    case 'SET_IMAGE_NAME':
      return Object.assign({}, state, {
        imageName: action.imageName
      })      
    case 'SAVE_IMAGE':
      return Object.assign({}, state, {
        save: action.save
      })     
    default:
      return state
  }
 
}

const updateUi = Redux.createStore(reducer);
 
updateUi.subscribe(() => {
  const data = updateUi.getState();
  (data.upload) ? hideSave() : showSave()
  if (data.save) uploadPhoto(data);
  if (data.imageName) upDateText(data.imageName)
});

const setUpload = (e) => ({type:'UPLOAD', upload: e.value})
const setImage = (e) => ({type:'ADD_IMAGE', image: e.value})
const setImageName = (e) => ({type:'SET_IMAGE_NAME', imageName: e.value})
const saveImage = (e) => ({type:'SAVE_IMAGE', save: e.value})

const showSave = () => {
  document.getElementById('upload-btn').style.display = 'none';
  document.getElementById('upload-name').style.display = 'block';
  document.getElementById('save-btn').style.display = 'block';
  document.getElementById('photo').style.display = 'block';
};

const hideSave = () => {
  document.getElementById('upload-btn').style.display = 'block';
  document.getElementById('upload-name').style.display = 'none';
  document.getElementById('save-btn').style.display = 'none';
  document.getElementById('photo').style.display = 'none';
};

const upDateText = (text) => {
  document.getElementById('name').value = text;
}






