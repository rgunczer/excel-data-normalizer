console.log('here');

function handleFileSelect(event) {
    console.log('do something here when file is selected');

    const files = evt.target.files; // FileList object


}

document.getElementById('files')
    .addEventListener('change', handleFileSelect, false);
