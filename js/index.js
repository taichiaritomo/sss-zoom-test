// DRAGGABLE WINDOWS
(function() {
    // Make the DIV element draggable:
    document.querySelectorAll('.draggable-window').forEach(draggableWindowElement => {
        enableDragging( draggableWindowElement );
    });

    function enableDragging(element) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        var draggableWindowHeader = element.querySelector('.draggable-window-header');
        if (draggableWindowHeader) {
            draggableWindowHeader.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
})();





// ZOOM

(function(){
	console.log('checkSystemRequirements');
	console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

    // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
    // if (!china) ZoomMtg.setZoomJSLib('https://source.zoom.us/1.7.7/lib', '/av'); // CDN version default
    // else ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.7.7/lib', '/av'); // china cdn option 
    // ZoomMtg.setZoomJSLib('http://localhost:9999/node_modules/@zoomus/websdk/dist/lib', '/av'); // Local version default, Angular Project change to use cdn version
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
    
    var API_KEY = 'LPwRseZAQ7uZyBjDs78bYg';

    /**
     * NEVER PUT YOUR ACTUAL API SECRET IN CLIENT SIDE CODE, THIS IS JUST FOR QUICK PROTOTYPING
     * The below generateSignature should be done server side as not to expose your api secret in public
     * You can find an eaxmple in here: https://marketplace.zoom.us/docs/sdk/native-sdks/web/essential/signature
     */
    var API_SECRET = '5snp1wtTzhogQygn34VvdN5YH1cOgjfd33pV';

    testTool = window.testTool;
    // document.getElementById('meeting_pwd').value = testTool.getCookie("meeting_pwd");

    document.getElementById('join_meeting').addEventListener('click', function(e){

        e.preventDefault();

        if(!this.form.checkValidity()){
            alert("Enter Name and Meeting Number");
            return false;
        }

        var meetConfig = {
            apiKey: API_KEY,
            apiSecret: API_SECRET,
            meetingNumber: 4538095026, // taichi's personal meeting room number
            userName: document.getElementById('display_name').value,
            // passWord: document.getElementById('meeting_pwd').value,
            passWord: 'knockknock', // taichi's personal meeting room password
            leaveUrl: "./",
            role: 0 // role: attendee
        };
        testTool.setCookie("meeting_number", meetConfig.meetingNumber);
        // testTool.setCookie("meeting_pwd", meetConfig.passWord);
        

        var signature = ZoomMtg.generateSignature({
            meetingNumber: meetConfig.meetingNumber,
            apiKey: meetConfig.apiKey,
            apiSecret: meetConfig.apiSecret,
            role: meetConfig.role,
            success: function(res){
                console.log(res.result);
            }
        });

        ZoomMtg.init({
            leaveUrl: './',
            sharingMode: 'fit', // set to 'both' to allow 'original size' option when watching a screenshare
            videoHeader: false, // NOT SURE WHAT THIS DOES YET
            showMeetingHeader: false, // NOT SURE WHAT THIS DOES YET
            disableInvite: true, // disable invite in participants screen
            isLockBottom: false, // auto-hide footer UI (join audio, etc.)
            isSupportChat: false, // disable chat
            screenShare: false, // disable screenshare
            success: function () {
                ZoomMtg.join(
                    {
                        meetingNumber: meetConfig.meetingNumber,
                        userName: meetConfig.userName,
                        signature: signature,
                        apiKey: meetConfig.apiKey,
                        passWord: meetConfig.passWord,
                        success: function(res){
                            $('#nav-tool').hide(); // Hide Login
                            $('#draggable-window-container').show();
                            console.log('join meeting success');
                        },
                        error: function(res) {
                            console.log(res);
                        }
                    }
                );
            },
            error: function(res) {
                console.log(res);
            }
        });

    });

})();
