// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    ComponentDialog,
    NumberPrompt,
    TextPrompt,
    WaterfallDialog,
    ChoiceFactory,
    ChoicePrompt,
} = require('botbuilder-dialogs');
const {
    ReviewSelectionDialog,
    REVIEW_SELECTION_DIALOG
} = require('./reviewSelectionDialog');

const {
    UserProfile
} = require('../userProfile');
const {
    MessageFactory,
    TeamsInfo,
    CardFactory,
    TurnContext,
    Builder
} = require('botbuilder');

const TOP_LEVEL_DIALOG = 'TOP_LEVEL_DIALOG';

const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TEXT_PROMPT = 'TEXT_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';

const CONFIRM_PROMPT = 'CONFIRM_PROMPT';

class TopLevelDialog extends ComponentDialog {
    constructor() {
        super(TOP_LEVEL_DIALOG);
        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        //   this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));


        this.addDialog(new ReviewSelectionDialog());

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.ipStep.bind(this),
            this.contactNumberStep.bind(this),
            this.startSelectionStep.bind(this),
         //   this.acknowledgementStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }



    async ipStep(stepContext) {
      
        //stepContext.values.userInfo = new UserProfile();

        const promptOptions = {
            prompt: 'Please enter host name or IP address.'
        };

        // Ask the user to enter their name.
        return await stepContext.prompt(TEXT_PROMPT, promptOptions);
    }

    async contactNumberStep(stepContext) {
      
        stepContext.values.ip = stepContext.result;
        console.log(stepContext.values.ip)
        const promptOptions = {
            prompt: 'Please enter your Contact number.'
        };

        
        return await stepContext.prompt(TEXT_PROMPT, promptOptions);
    }

    async startSelectionStep(stepContext) {
        // Set the user's age to what they entered in response to the age prompt.
        stepContext.values.name = stepContext._info.options.name;
        stepContext.values.email = stepContext._info.options.email;
        stepContext.values.contactNumber = stepContext.result;

        

        return await stepContext.beginDialog(REVIEW_SELECTION_DIALOG,stepContext.values);

    }

    // async acknowledgementStep(stepContext) {
    //     // Set the user's company selection to what they entered in the review-selection dialog.
    //     const userProfile = stepContext.values.userInfo;
    //     userProfile.companiesToReview = stepContext.result || [];

    //     await stepContext.context.sendActivity(`Thanks for participating ${ userProfile.name }`);

    //     // Exit the dialog, returning the collected user information.
    //     return await stepContext.endDialog(userProfile);
    // }
}

module.exports.TopLevelDialog = TopLevelDialog;
module.exports.TOP_LEVEL_DIALOG = TOP_LEVEL_DIALOG;