// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    ChoicePrompt,
    ComponentDialog,
    WaterfallDialog
} = require('botbuilder-dialogs');

const {
    IssueSelectionDialog,
    ISSUE_SELECTION_DIALOG
} = require('./issueSelectionDialog');
const {
    HelpdeskSummaryDialog,
    HELPDESK_SUMMARY_DIALOG
} = require('./helpdeskSummaryDialog');
const SUB_SELECTION_DIALOG = 'SUB_SELECTION_DIALOG';

const CHOICE_PROMPT = 'CHOICE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class SubSelectionDialog extends ComponentDialog {
    constructor() {
        super(SUB_SELECTION_DIALOG);

        // Define a "done" response for the company selection prompt.
        this.doneOption = 'done';

        // Define value names for values tracked inside the dialogs.
        this.companiesSelected = 'value-companiesSelected';

        // Define the company choices for the company selection prompt.
        this.harwareOptions = ["Desktop", "Laptop", "Network"];
        this.softwareOptions = ["E-mail", "Telephony", "FortiClient", "MS Teams", "MS Office", "Sim card Locked", "STrack", "Other"];
        this.networkOptions = ["WiFi"]
        this.addDialog(new IssueSelectionDialog());
        this.addDialog(new HelpdeskSummaryDialog());
        
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.selectionStep.bind(this),
            this.loopStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async selectionStep(stepContext) {
       
        stepContext.values.name = stepContext._info.options.name;
        stepContext.values.email = stepContext._info.options.email;
        stepContext.values.ip = stepContext._info.options.ip
        stepContext.values.contactNumber = stepContext._info.options.contactNumber
        stepContext.values.selection1 = stepContext._info.options.selection1
        let message = `Please choose the sub-category`;

        switch (stepContext.values.selection1) {
            case "Software":
                return await stepContext.prompt(CHOICE_PROMPT, {
                    prompt: message,
                    retryPrompt: 'Please choose an option from the list.',
                    choices: this.softwareOptions
                });
            case "Hardware":
                return await stepContext.prompt(CHOICE_PROMPT, {
                    prompt: message,
                    retryPrompt: 'Please choose an option from the list.',
                    choices: this.harwareOptions
                });
            case "Network":
                return await stepContext.prompt(CHOICE_PROMPT, {
                    prompt: message,
                    retryPrompt: 'Please choose an option from the list.',
                    choices: this.networkOptions
                });
        }



    }

    async loopStep(stepContext) {
        // Retrieve their selection list, the choice they made, and whether they chose to finish.
        stepContext.values.selection2 = stepContext.result.value;
        console.log(stepContext.values)

        let excludeFromIssuesStep = ["MS Teams", "MS Office", "Sim card Locked", "STrack", "Other"];

        if (excludeFromIssuesStep.includes(stepContext.values.selection2)) {
            stepContext.values.issue = stepContext.values.selection2
            stepContext.values.selection2 = stepContext.values.selection1
            console.log("Exclude")
            console.log(stepContext.values)

            return await stepContext.beginDialog(HELPDESK_SUMMARY_DIALOG, stepContext.values);
        } else {

            return await stepContext.beginDialog(ISSUE_SELECTION_DIALOG, stepContext.values);



        }

    }
}

module.exports.SubSelectionDialog = SubSelectionDialog;
module.exports.SUB_SELECTION_DIALOG = SUB_SELECTION_DIALOG;