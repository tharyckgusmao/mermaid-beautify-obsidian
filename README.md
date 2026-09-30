# Mermaid Themes

This is a plugin for [Obsidian](https://obsidian.md). It was generated based on the [standard plugin template](https://github.com/obsidianmd/obsidian-sample-plugin).

This project allows the user to easily apply and customize themes to mermaid.js diagrams in obsidian.

This plugin is supported by advertisements.

Note: this plugin is still in development, and there may be some bugs. Please report any issues you find.

It was inspired by the awesome new plugin for publishing your note content to Confluence. This project introduced me to Mermaid, and prompted me to make this.

-   [Markdown Confluence](https://github.com/markdown-confluence/markdown-confluence)

## Usage

Choose a built-in Mermaid theme or one of the curated palettes in the plugin settings. The palette gallery previews coordinated node fills, text, borders, and connectors. The curated palettes include Zinc, Tokyo Night, Catppuccin, Nord, Dracula, GitHub, Solarized, One Dark, Obsidian, Paper & Amber, Mint Night, Lavender Dusk, Coral & Slate, and Pastel Reverie.

Mermaid diagrams include zoom controls below each diagram. Use `+` and `−` to zoom, `↺` to fit the diagram in the available view without changing its proportions, drag to pan, pinch on touch screens, or `⛶` to expand the diagram over the note. Press `Escape` or `×` to return to the note. The `Scroll` control enables wheel zoom for an individual diagram; while disabled, the wheel continues to scroll the note.

Custom theme JSON is layered over the selected palette. It uses Mermaid's `base` theme and `themeVariables`, so existing Mermaid diagram syntax and diagram types continue to use Mermaid's renderer. Documentation about customizing Mermaid themes [is available here](https://mermaid.js.org/config/theming.html).

The `mermaid` code fence label is reserved. You have to use `merm` as an alternate. The code block looks like:

        ```merm
        ```

### Installation

Until this plugin is available in the community plugins list, you can install it as a beta tester using the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat).

Details on how to use it are available in their documentation. The short version is that you can install this plugin by adding the following custom plugin repository to your list of repositories in the BRAT plugin settings.

## Development

PR's are welcome. You can build the plugin with `npm run build` and the plugin will be built to the root folder, so using the built artifacts is easy. You can also run `npm run dev` to have it automatically rebuild when you make changes.

### Releasing new releases

This section is here to remind me how to release this.

Update your manifest.json with your new version number, such as 1.0.1, and the minimum Obsidian version required for your latest release.

Update your versions.json file with "new-plugin-version": "minimum-obsidian-version" so older versions of Obsidian can download an older version of your plugin that's compatible.

Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix v. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases

Upload the files manifest.json, main.js, styles.css as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.

Publish the release.

> You can simplify the version bump process by running npm version patch, npm version minor or npm version major after updating minAppVersion manually in manifest.json. The command will bump version in manifest.json and package.json, and add the entry for the new version to versions.json
