// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    ChoicePrompt,
    ComponentDialog,
    WaterfallDialog
} = require('botbuilder-dialogs');
const {
    SubSelectionDialog,
    SUB_SELECTION_DIALOG
} = require('./subSelectionDialog');



const REVIEW_SELECTION_DIALOG = 'REVIEW_SELECTION_DIALOG';

const CHOICE_PROMPT = 'CHOICE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class ReviewSelectionDialog extends ComponentDialog {
    constructor() {
        super(REVIEW_SELECTION_DIALOG);

        // Define a "done" response for the company selection prompt.
        this.doneOption = 'done';

        // Define value names for values tracked inside the dialogs.
        this.companiesSelected = 'value-companiesSelected';


        // Define the company choices for the company selection prompt.
        this.selectionOptions1 = ['Hardware', 'Software', 'Network'];
        this.addDialog(new SubSelectionDialog());
        
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.selectionStep.bind(this),
            this.loopStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async selectionStep(stepContext) {

        console.log(stepContext._info.options)
        stepContext.values.contactNumber = stepContext._info.options.contactNumber
        stepContext.values.ip = stepContext._info.options.ip
        // Create a prompt message.
        let message = `Please choose a category`;


        return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: message,
            retryPrompt: message,
            choices: this.selectionOptions1
        });
    }

    async loopStep(stepContext) {
        // Retrieve their selection list, the choice they made, and whether they chose to finish.
        console.log(stepContext.result)
        stepContext.values.selectionOption1 = stepContext.result.value;
        console.log(stepContext.values)
        //stepContext.values.choice1 = 
   
        return await stepContext.beginDialog(SUB_SELECTION_DIALOG);
    }
}

module.exports.ReviewSelectionDialog = ReviewSelectionDialog;
module.exports.REVIEW_SELECTION_DIALOG = REVIEW_SELECTION_DIALOG;