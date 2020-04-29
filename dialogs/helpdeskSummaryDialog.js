// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    MessageFactory,
    TeamsInfo,
    CardFactory,
    TurnContext,
    Builder
} = require('botbuilder');

const {
    ChoicePrompt,
    ComponentDialog,
    WaterfallDialog,
    TextPrompt
} = require('botbuilder-dialogs');

const {
    UserProfile
} = require('../userProfile');


const HELPDESK_SUMMARY_DIALOG = 'HELPDESK_SUMMARY_DIALOG';

const CHOICE_PROMPT = 'CHOICE_PROMPT';
const TEXT_PROMPT = 'TEXT_PROMPT'
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class HelpdeskSummaryDialog extends ComponentDialog {
    constructor() {
        super(HELPDESK_SUMMARY_DIALOG);


        this.doneOption = 'done';

        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.descriptionStep.bind(this),
            this.summaryStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async descriptionStep(stepContext) {
        stepContext.values.name = stepContext._info.options.name;
        stepContext.values.email = stepContext._info.options.email;
        stepContext.values.ip = stepContext._info.options.ip
        stepContext.values.contactNumber = stepContext._info.options.contactNumber
        stepContext.values.selection1 = stepContext._info.options.selection1
        stepContext.values.selection2 = stepContext._info.options.selection2
        stepContext.values.issue = stepContext._info.options.issue



        console.log("Hello from HelpdeskDialog")
        console.log(stepContext._info.options)

        const promptOptions = {
            prompt: 'Please provide a brief description of the problem.'
        };

        // Ask the user to enter their name.
        return await stepContext.prompt(TEXT_PROMPT, promptOptions);


    }

    async summaryStep(stepContext) {
        console.log("Hello from summary")

        // Retrieve their selection list, the choice they made, and whether they chose to finish.
        stepContext.values.description = stepContext.result;
        console.log(stepContext.values)
        var displayButtons = [ 

            {
                type: 'openUrl',
                title: 'Confirm',
                value: 'https://azure.microsoft.com/en-us/pricing/details/bot-service/',
                channelData: ''
            },
            {
                type: 'openUrl',
                title: 'Cancel',
                value: 'https://azure.microsoft.com/en-us/pricing/details/bot-service/'
            }]
        displayButtons = []

        let heading = "Thank you, a ticket with the following information will be logged:"
        return await stepContext.context.sendActivity({
            attachments: [this.createReceiptCard(stepContext.values, heading)]
        });

        const teamsChannel = '19:1b63a6843b344b03ae28d87953b16914@thread.skype';

        const serviceUrl = 'https://smba.trafficmanager.net/za/';

        // stepContext.context.activity.conversation.id = teamsChannel;
        // stepContext.context.activity.serviceUrl = serviceUrl;
      

        // await stepContext.context.sendActivity({
        //     loggedDetails: userProfile,
        //     attachments: [this.createReceiptCard(userProfile, "Ticket logged with the following information:", displayButtons)]
        // });



        // //set id of channel back to original value.
        // stepContext.context.activity.conversation.id = step.values.currentID;

        // await stepContext.context.sendActivity(`Please press any key on your keyboard to initiate another chat session.`);
























    }

    createReceiptCard(userProfile, title, displayButtons) {
        return CardFactory.receiptCard({
            title: title,
            facts: [{
                    key: 'Name',
                    value: userProfile.name
                },
                {
                    key: 'Email',
                    value: userProfile.email
                },
               
                {
                    key: 'Hostname',
                    value: userProfile.ip
                },
                {
                    key: 'Contact Number',
                    value: userProfile.contactNumber
                },
                {
                    key: 'Selection1',
                    value: userProfile.selection1
                },
                {
                    key: 'Selection2',
                    value: userProfile.selection2
                },
                {
                    key: 'Issue',
                    value: userProfile.issue
                },

                {
                    key: 'Description',
                    value: userProfile.description
                }
            ],



            buttons: CardFactory.actions(displayButtons)
        });
    }
}

module.exports.HelpdeskSummaryDialog = HelpdeskSummaryDialog;
module.exports.HELPDESK_SUMMARY_DIALOG = HELPDESK_SUMMARY_DIALOG;