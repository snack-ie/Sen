namespace Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert {
    /**
     * Structure
     */
    export enum Option {
        utf16le_text = 1,
        utf8bom_text,
        json_map,
        json_text,
    }

    /**
     * Structure
     */

    export interface Parameter {
        input: Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option;
        output: Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option;
    }

    /**
     *
     * @param information - Pass json text deserialize
     * @param file_path - Original file path
     * @returns if file is fine to process
     */

    export function TestJsonText<safe extends Sen.Shell.PvZ2Lawnstrings.JsonText>(information: Sen.Shell.PvZ2Lawnstrings.JsonText, file_path?: string): information is safe {
        if (information.objects[0].objdata.LocStringValues.length % 2 !== 0) {
            throw new Sen.Script.Modules.Exceptions.LawnstringsMapError(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("lawnstrings_map_contains_invalid_size"), [
                    `${information.objects[0].objdata.LocStringValues.length}`,
                    `${information.objects[0].objdata.LocStringValues.length + 1}`,
                    `${information.objects[0].objdata.LocStringValues.length - 1}`,
                ]),
                (file_path ??= "undefined")
            );
        }
        return true;
    }

    /**
     * Structure
     */

    export type extension = "txt" | "json";

    /**
     *
     * @param option - Pass option
     * @returns Extension
     */

    export function ExportExtension(option: Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Parameter): Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.extension {
        if (option.output === Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf16le_text || option.output === Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf8bom_text) {
            return "txt";
        }
        return "json";
    }

    /**
     *
     * @returns Print
     */

    export function PrintOption(): void {
        Sen.Shell.Console.Print(null, `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf16le_text}. ${Sen.Script.Modules.System.Default.Localization.GetString("lawnstring_text")}`);
        Sen.Shell.Console.Print(null, `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf8bom_text}. ${Sen.Script.Modules.System.Default.Localization.GetString("chinese_lawnstring_text")}`);
        Sen.Shell.Console.Print(null, `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.json_map}. ${Sen.Script.Modules.System.Default.Localization.GetString("lawnstring_json_map")}`);
        Sen.Shell.Console.Print(null, `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.json_text}. ${Sen.Script.Modules.System.Default.Localization.GetString("lawnstring_json_text")}`);
        return;
    }

    /**
     *
     * @param text - Pass text
     * @returns - The finished handle
     */

    export function ExtractListFromLawnstringText(text: string): Array<string> {
        const text_list: Array<string> = text.split("\n");
        const dict: Array<string> = new Array<string>();
        for (let i: int = 0; i < text_list.length; ++i) {
            if (text_list[i].startsWith("[") && text_list[i].endsWith("]")) {
                dict.push(text_list[i].slice(1, -1));
                let destination: int = -1;
                find_next: for (let j: int = i + 1; j < text_list.length; ++j) {
                    if (text_list[j].startsWith("[") && text_list[j].endsWith("]")) {
                        destination = j;
                        break find_next;
                    }
                }
                let text_ripe: string = "";
                if (destination !== -1) {
                    for (let k: int = i + 1; k < destination - 1; ++k) {
                        test_case: switch (text_list[k]) {
                            case "": {
                                text_ripe = text_ripe.concat("\r\n");
                                break test_case;
                            }
                            default: {
                                if (text_ripe !== "") {
                                    text_ripe = text_ripe.concat("\r\n");
                                }
                                text_ripe = text_ripe.concat(text_list[k]);
                                break test_case;
                            }
                        }
                        ++i;
                    }
                } else {
                    find_last: for (let j: int = text_list.length - 1; j > i; --j) {
                        if (text_list[j] === "") {
                            destination = j;
                            break find_last;
                        }
                    }
                    for (let k: int = i + 1; k < destination - 1; ++k) {
                        switch (text_list[k]) {
                            case "": {
                                text_ripe = text_ripe.concat("\r\n");
                                break;
                            }
                            default: {
                                text_ripe = text_ripe.concat(text_list[k]);
                            }
                        }
                        ++i;
                    }
                }
                dict.push(text_ripe);
            }
        }
        return dict;
    }

    /**
     *
     * @param text - Pass text
     * @returns JSON Map
     */

    export function ConvertTextToJsonMap(text: string): Sen.Shell.PvZ2Lawnstrings.JsonMap {
        const json_map: Sen.Shell.PvZ2Lawnstrings.JsonMap = {
            objects: [
                {
                    aliases: ["LawnStringsData"],
                    objclass: "LawnStringsData",
                    objdata: {
                        LocStringValues: {},
                    },
                },
            ],
            version: 1n,
        };
        const list_text: Array<string> = Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.ExtractListFromLawnstringText(text);
        for (let i: int = 0; i < list_text.length; ++i) {
            json_map.objects[0].objdata.LocStringValues[list_text[i]] = list_text[i + 1];
            i++;
        }
        return json_map;
    }

    /**
     *
     * @param text - Pass text
     * @returns JSON Text
     */

    export function ConvertTextToJsonText(text: string): Sen.Shell.PvZ2Lawnstrings.JsonText {
        const json_text: Sen.Shell.PvZ2Lawnstrings.JsonText = {
            objects: [
                {
                    aliases: ["LawnStringsData"],
                    objclass: "LawnStringsData",
                    objdata: {
                        LocStringValues: Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.ExtractListFromLawnstringText(text),
                    },
                },
            ],
            version: 1n,
        };
        return json_text;
    }

    /**
     *
     * @param information - Pass JSON Map Deserialize
     * @returns Text
     */

    export function JsonMapToText(information: Sen.Shell.PvZ2Lawnstrings.JsonMap): string {
        let text: string = "";
        const keys: Array<string> = Object.keys(information.objects[0].objdata.LocStringValues);
        keys.forEach((key: string) => {
            text = text.concat(`[${key}]`);
            text = text.concat(`\n`);
            text = text.concat(`${information.objects[0].objdata.LocStringValues[key].replace(/\r/g, ``)}`);
            text = text.concat(`\n`);
            text = text.concat(`\n`);
        });
        return text;
    }

    /**
     *
     * @param information - Pass Json Text
     * @returns - Text
     */

    export function JsonTextToText(information: Sen.Shell.PvZ2Lawnstrings.JsonText): string {
        let text: string = "";
        for (let i: int = 0; i < information.objects[0].objdata.LocStringValues.length; ++i) {
            text = text.concat(`[${information.objects[0].objdata.LocStringValues[i]}]`);
            text = text.concat(`\n`);
            text = text.concat(`${information.objects[0].objdata.LocStringValues[i + 1].replace(/\r/g, ``)}`);
            text = text.concat(`\n`);
            text = text.concat(`\n`);
            ++i;
        }
        return text;
    }

    /**
     *
     * @param infile - Pass input file
     * @param outfile - Pass output file
     * @param option - Pass option
     * @returns Converted lawnstrings
     */

    export function ConvertOfficialLawnstrings(infile: string, outfile: string, option: Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Parameter): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("obtained_encoding_type"));
        switch (option.input) {
            case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf16le_text: {
                Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("utf16le")}`);
                break;
            }
            case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf8bom_text: {
                Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("utf8bom")}`);
                break;
            }
            default: {
                Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("utf8")}`);
                break;
            }
        }
        if (option.input === option.output) {
            throw new Sen.Script.Modules.Exceptions.EvaluateError(Sen.Script.Modules.System.Default.Localization.GetString("cannot_convert_the_same_lawnstrings_type"), infile);
        }
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("output_encoding_type"));
        switch (option.output) {
            case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf16le_text: {
                Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("utf16le")}`);
                break;
            }
            case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf8bom_text: {
                Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("utf8bom")}`);
                break;
            }
            default: {
                Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("utf8")}`);
                break;
            }
        }
        if (option.input === Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.json_text) {
            Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.TestJsonText(Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Shell.PvZ2Lawnstrings.JsonText>(infile), infile);
        }
        if (option.input === Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.json_map) {
            switch (option.output) {
                case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf16le_text: {
                    Sen.Shell.PvZ2Lawnstrings.WriteUTF16Le(outfile, Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.JsonMapToText(Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Shell.PvZ2Lawnstrings.JsonMap>(infile)));
                    break;
                }
                case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.json_text: {
                    Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Shell.PvZ2Lawnstrings.JsonText>(outfile, Sen.Shell.PvZ2Lawnstrings.ConvertJsonMapToJsonText(infile), false);
                    break;
                }
                case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf8bom_text: {
                    Sen.Shell.PvZ2Lawnstrings.WriteUTF8Bom(outfile, Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.JsonMapToText(Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Shell.PvZ2Lawnstrings.JsonMap>(infile)));
                    break;
                }
            }
        } else if (option.input === Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.json_text) {
            switch (option.output) {
                case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf16le_text: {
                    Sen.Shell.PvZ2Lawnstrings.WriteUTF16Le(outfile, Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.JsonTextToText(Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Shell.PvZ2Lawnstrings.JsonText>(infile)));
                    break;
                }
                case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf8bom_text: {
                    Sen.Shell.PvZ2Lawnstrings.WriteUTF8Bom(outfile, Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.JsonTextToText(Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Shell.PvZ2Lawnstrings.JsonText>(infile)));
                    break;
                }
                case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.json_map: {
                    Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Shell.PvZ2Lawnstrings.JsonMap>(outfile, Sen.Shell.PvZ2Lawnstrings.ConvertJsonTextToJsonMap(infile), false);
                    break;
                }
            }
        } else if (option.input === Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf16le_text) {
            switch (option.output) {
                case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.json_text: {
                    Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Shell.PvZ2Lawnstrings.JsonText>(
                        outfile,
                        Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.ConvertTextToJsonText(Sen.Shell.PvZ2Lawnstrings.ReadUTF16Le(infile)),
                        true
                    );
                    break;
                }
                case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.json_map: {
                    Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Shell.PvZ2Lawnstrings.JsonMap>(
                        outfile,
                        Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.ConvertTextToJsonMap(Sen.Shell.PvZ2Lawnstrings.ReadUTF16Le(infile)),
                        true
                    );
                    break;
                }
                case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf8bom_text: {
                    Sen.Shell.PvZ2Lawnstrings.WriteUTF8Bom(outfile, Sen.Shell.PvZ2Lawnstrings.ReadUTF16Le(infile));
                    break;
                }
            }
        } else {
            switch (option.output) {
                case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.json_text: {
                    Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Shell.PvZ2Lawnstrings.JsonText>(
                        outfile,
                        Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.ConvertTextToJsonText(Sen.Shell.PvZ2Lawnstrings.ReadUTF8Bom(infile)),
                        true
                    );
                    break;
                }
                case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.json_map: {
                    Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Shell.PvZ2Lawnstrings.JsonMap>(
                        outfile,
                        Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.ConvertTextToJsonMap(Sen.Shell.PvZ2Lawnstrings.ReadUTF8Bom(infile)),
                        true
                    );
                    break;
                }
                case Sen.Script.Modules.Support.PopCap.PvZ2.Lawnstrings.Convert.Option.utf8bom_text: {
                    Sen.Shell.PvZ2Lawnstrings.WriteUTF16Le(outfile, Sen.Shell.PvZ2Lawnstrings.ReadUTF8Bom(infile));
                    break;
                }
            }
        }

        return;
    }
}
