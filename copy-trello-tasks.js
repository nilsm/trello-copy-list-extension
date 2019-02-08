/**
 * Created by Nathalie Rud on 24-Sep-16.
 * Updated by Nils Millahn on 8-Feb-19.
 */

(function(){
  var newScript = document.createElement('script');
  newScript.type = 'text/javascript';
  newScript.src = 'https://use.fontawesome.com/5ea3d84a35.js';
  document.body.appendChild(newScript);

  init();

  function init() {

    // the first 5 Trello lists are added straight away
    // any remaining lists are added later on by Javascript
    // we need to add buttons to both types
    // it seems they all come together one by one, followed by a bunch of other elements
    var ob = new MutationObserver(function(records){
      for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.addedNodes) {
          for (var j = 0; j < record.addedNodes.length; j++) {
            var node = record.addedNodes[j];
            if (node.className && node.className == 'boards-drawer') {
              addCopyButton();
              break;
            }
          }
        }
      }
    });
    ob.observe(document.body, {
      attributes: false,
      childList: true,
      subtree: true
    });
  }

  function addCopyButton() {
    var lists = document.getElementsByClassName('js-list list-wrapper');
    for(var i = 0; i < lists.length; i++) {
      var listElement = lists[i];
      listElement.id = 'js-list-' + i;
      var buttonWrapperElement = listElement.getElementsByClassName('js-list-header')[0];

      if (buttonWrapperElement) {
        var buttonElement = document.createElement('a');
        buttonElement.className = 'js-list-copy-btn';
        buttonElement.innerHTML = '<i class="fa fa-clipboard" aria-hidden="true"></i>';
        buttonWrapperElement.appendChild(buttonElement);
        buttonElement.addEventListener('click', copyTasksTitles);
      }
    }
  }

  function copyTasksTitles(e) {
    try {
      var listWrapper = getClosestClassElement(e.target, 'list-wrapper');
      var tasks = listWrapper.getElementsByClassName('list-card-title js-card-name');
      var res = '';
      var count = 0;
      for (var i = 0; i < tasks.length; i++) {
        var taskElement = tasks[i];
        res += taskElement.innerText + '\r\n';
        count += 1;
      }
      copyToClipboard(res);
      showBasicNotification('Trello copy list', count + ' task(s) copied to clipboard',
      chrome.runtime.getURL('icons/edit-copy.svg'))
    }
    catch(e){
      alert('Trello list was NOT copied!\nError occured: ' + e.message)
    }
  }

  function getClosestClassElement(element, className) {
    do {
      if (element.classList.contains(className))
        return element;
    } while (element = element.parentNode);
    return null;
  }

  function copyToClipboard(text){
    var dummy = document.createElement('textarea');
    dummy.setAttribute('id', 'dummy_id');
    dummy.setAttribute('class', 'hidden');
    document.body.appendChild(dummy);
    if (text == '') text =' ';
    document.getElementById('dummy_id').value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  }

  function showBasicNotification(title, msg, img) {
    var opt = {
      type: 'basic',
      title: title,
      message: msg,
      iconUrl: img
    };
    chrome.runtime.sendMessage(opt);
  }

})();
