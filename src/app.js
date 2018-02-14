function previewFile(){
  updateUi.dispatch(setUpload({value: false}))
  var preview = document.querySelector('img'); //selects the query named img
  var file    = document.querySelector('input[type=file]').files[0]; //sames as here
  var reader  = new FileReader();

  reader.onloadend = function () {
    preview.src = reader.result;
  }

  if (file) {
  reader.readAsDataURL(file); //reads the data as a URL
  updateUi.dispatch(setImage({value: reader}))
  } else {
    preview.src = "";
  }
}

$(document).on('click', '#save-btn', () => {  
  updateUi.dispatch(saveImage({value: true}))
  updateUi.dispatch(saveImage({value:false}))
  updateUi.dispatch(setImageName({value: ''}))
  $('#name').val('')
  $('#photo').attr("src","");
 // updateUi.dispatch(setImage({value: ''}))

})

$(document).on('click','#upload-btn', () => {
   $('input').val(null); 
})

$(document).on('keyup', '#name', (e) => {
  const key = document.getElementById('name').value;
  updateUi.dispatch(setImageName({value: key}))
})

$(document).on('keyup', '.image-name', (e) => {
  const id = e.target.id.replace('image-name-', '');
  const text = e.target.value;
  const data = {};
  data.id = id;
  data.text = text;
  console.log(data)
  dataUpdate.dispatch(updateImageName({ value: data}))
})


$(document).on('keyup', 'textarea', (e) => {
  const id = e.target.id.replace('tag-', '');
  const text = e.target.value;
  const data = {};
  data.id = id;
  data.text = text;
  dataUpdate.dispatch(updateTags({ value: data}))
})



var photos = firebase.database().ref('/photos');
  photos.on('value', function(data) { 
    let tags = '';
    dataUpdate.dispatch(updateData({value: data.val()}))
    var data = data.val();
     $('#gallary').empty();
    for (var i in data) {    
      $('#gallary').prepend( 
        '<div class="card">' +
        '<div id="'+ i +'" class="card-header">'+
        '<input id="image-name-' + i + '" type="text" value="' + data[i].name + '"class="image-name"></input>'+
        '<span class="delete"><i class="material-icons">delete</i></span>' +        
        '</div>'+
        '<span>'+ data[i].timestamp +'</span>' + 
        '<img width="180px" src="'+ data[i].url +'"  />' +      
        '<textarea placeholder="Add tags..."  id="tag-' + i + '">'+ data[i].tags +'</textarea>'+        
        '<button onClick="saveDataChanges()">Update Changes</button>'+
        '</div>'
      )
    };
});

$(document).on('click', '.delete', (e) =>{
  let id = e.currentTarget.parentElement.id;
  firebase.database().ref('photos/' + id).remove();
})


const uploadPhoto = (data) => {
  
  const ref = firebase.storage().ref();
  const name = (+new Date()) + '-' + data.imageName;
  const metadata = {
  contentType: data.image.type
  };
  const task = ref.child('images/' + name).putString(data.image.result, 'data_url'); 
  task.on('state_changed', function(snapshot){
    monitorUpload(snapshot);
  }, function(error) {
    // Handle unsuccessful uploads

  }, function() {
    updateUi.dispatch(saveImage({value: false}))
    updateUi.dispatch(setUpload({value: true}))

    const downloadURL = task.snapshot.downloadURL;
    updataPhotoToFb(downloadURL, data.imageName)
  });
}

const monitorUpload = (snapshot) => {
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
  switch (snapshot.state) {
    case firebase.storage.TaskState.PAUSED: // or 'paused'
      console.log('Upload is paused');
      break;
    case firebase.storage.TaskState.RUNNING: // or 'running'
      console.log('Upload is running');
      break;
  }

}

const updataPhotoToFb = (downloadURL, imageName) => {
  const time = new Date().getTime();
  const timestamp = moment().format("MMMM DD YYYY")
  const data = {};

  data[time] = { url:downloadURL, 
    name:imageName, 
    timestamp: 
    timestamp, tags: '' 
  }
  firebase.database().ref('photos/').update(data);
}