// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    ChoicePrompt,
    ComponentDialog,
    WaterfallDialog
} = require('botbuilder-dialogs');


const ISSUE_SELECTION_DIALOG = 'ISSUE_SELECTION_DIALOG';
const {
    HelpdeskSummaryDialog,
    HELPDESK_SUMMARY_DIALOG
} = require('./helpdeskSummaryDialog');

const CHOICE_PROMPT = 'CHOICE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class IssueSelectionDialog extends ComponentDialog {
    constructor() {
        super(ISSUE_SELECTION_DIALOG);

        // Define a "done" response for the company selection prompt.
        this.doneOption = 'done';
        this.addDialog(new HelpdeskSummaryDialog());
        // Define value names for values tracked inside the dialogs.
        //this.companiesSelected = 'value-companiesSelected';


        //Hardware issues category selection variables
        this.hwDesktopOptions = ["Keyboard", "Monitor", "Not booting / No Power", "Wallboard", "Mouse", "Blue Screen"];
        this.hwLaptopOptions = ["Keyboard", "LCD", "FortiClient", "Charger", "Blue screen", "Stolen, Lost, Physical damaged laptops", "Mouse", "Battery"];
        this.hwNetworkOptions = ["Faulty SIM Card", "Faulty 3G USB Modem", "Slow Network Response"];

        //Software issue category selection variables
        this.swEmailOptions = ["General", "Disconnected"];
        this.swTelephonyOption = ["Avaya"];
        this.swFortiClientOptions = ["(-5) Connection", "(-12) Connection", "Setup", "(-9) Connection", "98% Re-install", "Server unreachable"];

        //Network issue category selection variables
        this.nwWifiOptions = ["Wifi not picking up"];

        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.selectionStep.bind(this),
            this.lastStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async selectionStep(stepContext) {

        stepContext.values.name = stepContext._info.options.name;
        stepContext.values.email = stepContext._info.options.email;
        stepContext.values.ip = stepContext._info.options.ip
        stepContext.values.contactNumber = stepContext._info.options.contactNumber
        stepContext.values.selection1 = stepContext._info.options.selection1
        stepContext.values.selection2 = stepContext._info.options.selection2
        
        let message = `Please choose the issue that you are experiencing`;

        switch (stepContext.values.selection2) {
            case "Desktop":
                return await stepContext.prompt(CHOICE_PROMPT, {
                    prompt: message,
                    retryPrompt: 'Please choose an option from the list.',
                    choices: this.hwDesktopOptions
                });
            case "Laptop":
                return await stepContext.prompt(CHOICE_PROMPT, {
                    prompt: message,
                    retryPrompt: 'Please choose an option from the list.',
                    choices: this.hwLaptopOptions
                });
            case "Network":
                return await stepContext.prompt(CHOICE_PROMPT, {
                    prompt: message,
                    retryPrompt: 'Please choose an option from the list.',
                    choices: this.hwNetworkOptions
                });
            case "E-mail":
                return await stepContext.prompt(CHOICE_PROMPT, {
                    prompt: message,
                    retryPrompt: 'Please choose an option from the list.',
                    choices: this.swEmailOptions
                });
            case "Telephony":
                return await stepContext.prompt(CHOICE_PROMPT, {
                    prompt: message,
                    retryPrompt: 'Please choose an option from the list.',
                    choices: this.swTelephonyOption
                });
            case "FortiClient":
                return await stepContext.prompt(CHOICE_PROMPT, {
                    prompt: message,
                    retryPrompt: 'Please choose an option from the list.',
                    choices: this.swFortiClientOptions
                });
            case "WiFi":
                
                return await stepContext.prompt(CHOICE_PROMPT, {
                    prompt: message,
                    retryPrompt: 'Please choose an option from the list.',
                    choices: this.nwWifiOptions
                });
        }



    }

    async lastStep(stepContext) {
        // Retrieve their selection list, the choice they made, and whether they chose to finish.
        console.log("..........................................................")
        console.log(stepContext._info.options.selection1)
      
        stepContext.values.issue = stepContext.result.value;
        

        return await stepContext.beginDialog(HELPDESK_SUMMARY_DIALOG, stepContext.values);

    }
}

module.exports.IssueSelectionDialog = IssueSelectionDialog;
module.exports.ISSUE_SELECTION_DIALOG = ISSUE_SELECTION_DIALOG;