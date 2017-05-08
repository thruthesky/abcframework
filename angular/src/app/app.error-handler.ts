import { ErrorHandler, Injectable } from '@angular/core';
@Injectable()
export class CustomErrorHandler implements ErrorHandler {
    constructor() { }
    handleError(error) {

        this.displayError( error );


        // IMPORTANT: Rethrow the error otherwise it gets swallowed
        throw error;
    }


    displayError( error ) {
        var handler = document.querySelector('#custom-error-handler');
        if ( !handler ) {
            var div = document.createElement('div');
            div.id = "custom-error-handler";
            document.body.insertBefore(div, document.body.firstChild);
            handler = document.querySelector('#custom-error-handler');
        }
        var div = document.createElement('div');
        div.innerText = error.stack;

        var h2 = document.createElement('h2');
        h2.innerText = error.message;

        handler.appendChild(h2);
        handler.appendChild(div);
    }

}