// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

class UserProfile {
    constructor(name, age,selection1) {
        this.name = name;
        this.age = age;
        this.selection1 = selection1;

        // The list of companies the user wants to review.
        this.companiesToReview = [];
    }
}

module.exports.UserProfile = UserProfile;
