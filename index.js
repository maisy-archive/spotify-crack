const { Plugin } = require('@vizality/entities');
const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');
const isPremium = getModule(['isSpotifyPremium'], false);
const Profile = getModule(['getProfile'], false);
const Dispatcher = getModule(['dispatch'], false);

module.exports = class extends Plugin {
   start() {
      patch('sc-getProfile', Profile, 'getProfile', async function (args) {
         patch('sc-isPremium', isPremium, 'isSpotifyPremium', async function (_) {
            return true;
         });
         Dispatcher.dispatch({ type: 'SPOTIFY_PROFILE_UPDATE', accountId: args[0], isPremium: true });
         unpatch('sc-isPremium');
         return;
      });
   }

   stop() {
      unpatch('sc-getProfile');
      unpatch('sc-isPremium');
   }
};
