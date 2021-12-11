class ErrorApi extends Error{
    
    constructor(status, text){
        super(text)
        this.status = status;
        this.text = text
    }
}

module.exports = ErrorApi