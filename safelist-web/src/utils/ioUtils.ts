export const ioUtils = {

  downloadBlob(downloadObject: any, filename: string) {
    const exportObjectJson = JSON.stringify(downloadObject, null, 2);
    const blob = new Blob([exportObjectJson], {type: 'text/plain'});
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;        
    document.body.appendChild(elem);
    elem.click();        
  }

}