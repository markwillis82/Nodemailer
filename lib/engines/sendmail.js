var spawn = require('child_process').spawn;

// Expose to the world
module.exports = SendmailTransport;

/**
 * <p>Generates a Transport object for Sendmail</p>
 * 
 * @constructor
 * @param {String} [config] path to the sendmail command
 */
function SendmailTransport(config){
    this.path = typeof config=="string"?config:"sendmail";
}

/**
 * <p>Spawns a <code>'sendmail -t'</code> command and streams the outgoing
 * message to sendmail stdin. Return callback checks if the sendmail process
 * ended with 0 (no error) or not.</p>
 * 
 * @param {Object} emailMessage MailComposer object
 * @param {Function} callback Callback function to run when the sending is completed
 */
SendmailTransport.prototype.sendMail = function(emailMessage, callback) {

    // sendmail strips this header line by itself
    emailMessage.options.keepBcc = true;
    
    var sendmail = spawn(this.path, ["-t"]);
    
    sendmail.on('exit', function (code) {
        var msg = "Sendmail exited with "+code;
        if(typeof callback == "function"){
            callback(code?new Error(msg):null, {message: msg});
        }
    });
    
    emailMessage.pipe(sendmail.stdin);
    emailMessage.streamMessage();
    
};