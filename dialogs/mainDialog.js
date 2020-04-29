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
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    WaterfallDialog
} = require('botbuilder-dialogs');
const {
    TopLevelDialog,
    TOP_LEVEL_DIALOG,
    SUB_SELECTION_DIALOG
} = require('./topLevelDialog');

const MAIN_DIALOG = 'MAIN_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const USER_PROFILE_PROPERTY = 'USER_PROFILE_PROPERTY';
const WELCOMED_USER = 'welcomedUserProperty';

class MainDialog extends ComponentDialog {
    constructor(userState) {
        super(MAIN_DIALOG);
        this.userState = userState;
        this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);

        this.addDialog(new TopLevelDialog());
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.helloStep.bind(this),
            this.initialStep.bind(this),
            this.finalStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async helloStep(stepContext) {



        //download URL for image


        const didBotWelcomedUser = await this.welcomedUserProperty.get(stepContext.context, false);

        const member = await TeamsInfo.getMember(stepContext.context, stepContext.context.activity.from.id);
        stepContext.values.currentID = stepContext.context.activity.conversation.id

        stepContext.values.name = member.name;
        stepContext.values.email = member.email;

        // console.log(member)

        if (didBotWelcomedUser === false) {
            // The channel should send the user name in the 'From' object



          //  await step.context.sendActivity(`Hello ${ member.givenName }, to proceed with logging a Helpdesk ticket, please provide the following details:`);
            await stepContext.context.sendActivity(`Hello ${member.givenName}, to proceed with logging a Helpdesk ticket, please provide the following details:`);




        }

        await this.welcomedUserProperty.set(stepContext.context, true);

        return await stepContext.next();











    }

    async initialStep(stepContext) {
        return await stepContext.beginDialog(TOP_LEVEL_DIALOG,stepContext.values);
    }

    async finalStep(stepContext) {
        
        await stepContext.context.sendActivity(`Please press any key on your keyboard to initiate another chat session.`);
        return await stepContext.endDialog();
    }
}

module.exports.MainDialog = MainDialog;
module.exports.MAIN_DIALOG = MAIN_DIALOG;

