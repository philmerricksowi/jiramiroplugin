function contains(a1, a2) {
    let superSet = {};
    for (let i = 0; i < a1.length; i++) {
        const e = a1[i];
        superSet[e] = 1;
    }

    for (let i = 0; i < a2.length; i++) {
        const e = a2[i];
        if (!superSet[e]) {
            return false;
        }
    }
    return true;
}

class MiroAuthorizer {

    constructor(requiredScope, appUrl) {
        this.requiredScope = requiredScope;
        this.authz = false;
        this.appUrl = appUrl;
        this.authorizeOptions = {
            response_type: 'token',
            redirect_uri: appUrl+'/installComplete'
        };
    }

    async authorized() {
        if (!this.authz) {
            this.authz = contains(await miro.currentUser.getScopes(), this.requiredScope);
            if (!this.authz) {
                this.promptForAuthentication();
            }
        }

        return this.authz;
    }

    async authorize() {
        return miro.authorize(this.authorizeOptions);
    }

    promptForAuthentication() {
        miro.board.ui.openModal(this.appUrl+"/install", {width: 740, height: 600})
    }
}