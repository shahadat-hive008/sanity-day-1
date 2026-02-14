import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'vueoaspm',
    dataset: 'production',
  },
  server: {
    port: 3334,
  },
  deployment: {
    appId: 'l56n7vwcbpw2tt6432o2mqaa',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
