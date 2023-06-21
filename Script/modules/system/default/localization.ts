namespace Sen.Script.Modules.System.Default.Localization {
    /**
     * Entry json
     */
    export type entry_json = {
        default: {
            language: string;
            notification_when_finish: boolean;
            override: boolean;
            use_trailing_commas: boolean;
        };
    };

    export const EntryJson: Sen.Script.Modules.System.Default.Localization.entry_json = Sen.Script.Modules.FileSystem.Json.ReadJson<entry_json>(
        `${MainScriptDirectory}/modules/customization/entry.json`
    );

    /**
     * Tool language
     */

    export const notification: boolean = Sen.Script.Modules.System.Default.Localization.EntryJson.default.notification_when_finish;

    /**
     * Tool language
     */

    export const language: string = Sen.Script.Modules.System.Default.Localization.EntryJson.default.language;

    /**
     * Override file/directory
     */

    export const override: boolean = Sen.Script.Modules.System.Default.Localization.EntryJson.default.override;

    /**
     * If enabled, json output will be trailing commas
     */

    export const use_trailing_commas: boolean = Sen.Script.Modules.System.Default.Localization.EntryJson.default.use_trailing_commas;
    /**
     *
     * @param property - Provide property to get
     * @returns String if exists, else return property
     */

    export function GetString(property: string): string {
        return DotNetLocalization.Get(
            property,
            Path.Resolve(`${MainScriptDirectory}/modules/customization/language`),
            `${Sen.Script.Modules.System.Default.Localization.language}`
        );
    }

    /**
     *
     * @param inputString - Pass the string like Test {1} {2} {3}
     * @param replacements - Pass array ["test", "test", "t"]
     * @returns Test test test t
     */

    export function RegexReplace(inputString: string, replacements: Array<string>): string {
        return inputString.replace(/\{(\d+)\}/g, (match: string, index: string) => {
            let replacementIndex: number = parseInt(index) - 1;
            return replacements[replacementIndex] || match;
        });
    }
}
