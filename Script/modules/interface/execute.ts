namespace Sen.Script.Modules.Interface.Execute {
    /**
     *
     * @param argument - Pass argument
     */
    export function ExecuteArgument(argument: string | Array<string>): void {
        const available: Array<int> = new Array();
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Localization.GetString("all_functions_loaded")
            )
        );
        if (Array.isArray(argument)) {
            for (const func of Sen.Script.Modules.Interface.Assert.FunctionCollection) {
                if (func === "popcap_official_atlas_split" || func === "popcap_unofficial_atlas_split") {
                    if (Sen.Script.Modules.Interface.Assert.CheckForJsonAndPng(argument)) {
                        Console.Printf(
                            null,
                            `      ${
                                Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number
                            }. ${Sen.Script.Modules.System.Default.Localization.GetString(func)}`
                        );
                        available.push(Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number);
                        continue;
                    }
                }
                const assert_test: boolean = argument.every((arg: string) =>
                    Sen.Script.Modules.FileSystem.FilterFilePath(
                        arg,
                        Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].include,
                        Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].exclude
                    )
                );
                if (assert_test) {
                    Console.Printf(
                        null,
                        `      ${
                            Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number
                        }. ${Sen.Script.Modules.System.Default.Localization.GetString(func)}`
                    );
                    available.push(Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number);
                }
            }
        } else {
            Sen.Script.Modules.Interface.Assert.FunctionCollection.forEach((func: string) => {
                if (
                    Sen.Script.Modules.FileSystem.FilterFilePath(
                        argument,
                        Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].include,
                        Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].exclude
                    )
                ) {
                    Console.Printf(
                        null,
                        `      ${
                            Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number
                        }. ${Sen.Script.Modules.System.Default.Localization.GetString(func)}`
                    );
                    available.push(Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number);
                }
            });
        }
        if (available.length === 0) {
            Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(
                    /\{\}/g,
                    Sen.Script.Modules.System.Default.Localization.GetString("no_function_were_found")
                )
            );
            return;
        }
        const func_name: function_name = Sen.Script.Modules.Interface.Execute.GetFunctionName(Sen.Script.Modules.Interface.Arguments.TestInput(available));
        Sen.Script.Modules.Interface.Execute.Evaluate(func_name, argument);
        return;
    }

    /**
     *
     * @param option - Pass user input
     * @returns The function number name
     */

    export function GetFunctionName(option: int): function_name {
        let index: number = -1;
        for (let i: number = 0; i < Sen.Script.Modules.Interface.Assert.FunctionNumbers.length; ++i) {
            if (Sen.Script.Modules.Interface.Assert.FunctionNumbers[i] === option) {
                index = i;
                break;
            }
        }
        return Sen.Script.Modules.Interface.Assert.FunctionCollection[index] as function_name;
    }

    /**
     * function
     */

    export type function_name =
        | "js_evaluate"
        | "popcap_ptx_encode"
        | "popcap_ptx_decode"
        | "popcap_official_resources_split"
        | "popcap_official_resources_merge"
        | "popcap_official_atlas_split"
        | "popcap_official_pam_to_pam_json"
        | "popcap_official_pam_json_to_pam"
        | "popcap_official_atlas_merge"
        | "popcap_unofficial_atlas_split"
        | "popcap_unofficial_atlas_merge"
        | "popcap_unofficial_resources_split"
        | "popcap_unofficial_resources_merge"
        | "popcap_rton_to_json"
        | "popcap_json_to_rton"
        | "popcap_sprite_resize"
        | "popcap_official_pam_to_flash_animation"
        | "popcap_official_pam_from_flash_animation"
        | "popcap_official_resources_to_unofficial_resources"
        | "popcap_unofficial_resources_to_official_resources"
        | "popcap_rsg_unpack"
        | "popcap_rsg_pack"
        | "popcap_official_pam_json_to_flash_animation"
        | "popcap_official_pam_json_from_flash_animation"
        | "popcap_rsb_unpack"
        | "popcap_rsb_pack";

    /**
     *
     * @param function_name - Function name
     * @param argument - Pass argument
     * @returns Evaluate the tool
     */

    export function Evaluate(function_name: Sen.Script.Modules.Interface.Execute.function_name, argument: string | string[]): void {
        const func_time_start: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        switch (function_name) {
            case "js_evaluate": {
                if (!Array.isArray(argument)) {
                    Sen.Script.Modules.System.Implement.JavaScript.JSEvaluate(argument);
                } else {
                    argument.forEach((arg: string) => Sen.Script.Modules.System.Implement.JavaScript.JSEvaluate(arg));
                }
                break;
            }
            case "popcap_official_resources_to_unofficial_resources": {
                if (!Array.isArray(argument)) {
                    const expand_path: "array" | "string" =
                        (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                            Sen.Script.Modules.System.Default.Localization.GetString("using_popcap_resources_path"),
                            [1, 2],
                            {
                                "1": [
                                    Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_old_resources"),
                                    Sen.Script.Modules.System.Default.Localization.GetString("using_old_resources_path"),
                                ],
                                "2": [
                                    Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_new_resources"),
                                    Sen.Script.Modules.System.Default.Localization.GetString("using_new_resources_path"),
                                ],
                            },
                            `${MainScriptDirectory}/modules/customization/methods/popcap_resources_conversion.json`,
                            `expand_path`
                        ) as 1 | 2) === 1
                            ? "array"
                            : "string";
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/res.json`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.UnofficialResourceConversion.CreateConversion(
                        argument,
                        output_argument,
                        expand_path
                    );
                } else {
                    argument.forEach((arg: string) => {
                        const expand_path: "array" | "string" =
                            (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("using_popcap_resources_path"),
                                [1, 2],
                                {
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_old_resources"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("using_old_resources_path"),
                                    ],
                                    "2": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_new_resources"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("using_new_resources_path"),
                                    ],
                                },
                                `${MainScriptDirectory}/modules/customization/methods/popcap_resources_conversion.json`,
                                `expand_path`
                            ) as 1 | 2) === 1
                                ? "array"
                                : "string";
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/res.json`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.UnofficialResourceConversion.CreateConversion(
                            arg,
                            output_argument,
                            expand_path
                        );
                    });
                }
                break;
            }
            case "popcap_rsg_unpack": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.packet`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGUnpack(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.packet`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGUnpack(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_rsg_pack": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.rsg`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGPack(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.rsg`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGPack(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_rsb_unpack": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name}.bundle`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.RSBUnpack(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name}.bundle`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.RSBUnpack(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_rsb_pack": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.RSBPack(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.RSBPack(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_unofficial_resources_to_official_resources": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/resources.json`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.ConvertToOfficial.CreateConversion(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/resources.json`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.ConvertToOfficial.CreateConversion(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_unofficial_resources_split": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.json.info`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.SplitUnofficialResources.CreateConversion(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.json.info`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.SplitUnofficialResources.CreateConversion(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_official_pam_from_flash_animation": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.pam`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.FlashAnimationtoPAM(
                        argument,
                        output_argument,
                        Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo>(`${argument}/extra.json`)
                    );
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.pam`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.FlashAnimationtoPAM(
                            arg,
                            output_argument,
                            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo>(`${arg}/extra.json`)
                        );
                    });
                }
                break;
            }
            case "popcap_rton_to_json": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.json`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.RTONDecode(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.json`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.RTONDecode(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_json_to_rton": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.rton`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.RTONEncode(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.rton`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.RTONEncode(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_unofficial_resources_merge": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.json`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.MergeUnofficialJson.CreateConversion(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.json`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.SplitUnofficialResources.CreateConversion(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_ptx_decode": {
                if (!Array.isArray(argument)) {
                    const encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial =
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputEncode();
                    const dimension: Sen.Script.Modules.BitMap.Constraints.DimensionInterface<int> =
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputDimension();
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.png`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.DecodePopCapPTX(argument, output_argument, dimension.width, dimension.height, encode);
                } else {
                    argument.forEach((arg: string) => {
                        const encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputEncode();
                        const dimension: Sen.Script.Modules.BitMap.Constraints.DimensionInterface<int> =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputDimension();
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.png`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.DecodePopCapPTX(
                            argument,
                            output_argument,
                            dimension.width,
                            dimension.height,
                            encode
                        );
                    });
                }
                break;
            }
            case "popcap_official_atlas_merge": {
                if (!Array.isArray(argument)) {
                    const destination: Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.AtlasMergeInputRequirement =
                        Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputAtlasMerge();
                    Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackFromAtlasJson.PackForOfficialSubgroupStructure(argument, destination);
                } else {
                    argument.forEach((arg: string) => {
                        const destination: Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.AtlasMergeInputRequirement =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputAtlasMerge();
                        Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackFromAtlasJson.PackForOfficialSubgroupStructure(arg, destination);
                    });
                }
                break;
            }
            case "popcap_ptx_encode": {
                if (!Array.isArray(argument)) {
                    const encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial =
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputEncode();
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.ptx`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(argument, output_argument, encode);
                } else {
                    argument.forEach((arg: string) => {
                        const encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputEncode();
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.ptx`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(argument, output_argument, encode);
                    });
                }
                break;
            }
            case "popcap_official_resources_split": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.res`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.SplitPopCapResources(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.res`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.SplitPopCapResources(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_official_resources_merge": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.json`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.MergePopCapResources(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.json`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.MergePopCapResources(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_official_atlas_split": {
                if (Array.isArray(argument)) {
                    const method: "id" | "path" =
                        (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                            Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_method"),
                            [1, 2],
                            {
                                "1": [
                                    Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_id"),
                                    Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_id"),
                                ],
                                "2": [
                                    Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_path"),
                                    Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_path"),
                                ],
                            },
                            `${MainScriptDirectory}/modules/customization/methods/popcap_atlas_split.json`,
                            `method`
                        ) as 1 | 2) === 2
                            ? "path"
                            : "id";
                    const expand_path: "array" | "string" =
                        (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                            Sen.Script.Modules.System.Default.Localization.GetString("using_popcap_resources_path"),
                            [1, 2],
                            {
                                "1": [
                                    Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_old_resources"),
                                    Sen.Script.Modules.System.Default.Localization.GetString("using_old_resources_path"),
                                ],
                                "2": [
                                    Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_new_resources"),
                                    Sen.Script.Modules.System.Default.Localization.GetString("using_new_resources_path"),
                                ],
                            },
                            `${MainScriptDirectory}/modules/customization/methods/popcap_atlas_split.json`,
                            `expand_path`
                        ) as 1 | 2) === 1
                            ? "array"
                            : "string";
                    Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.ExtractOfficialAtlas.ExtractPvZ2AtlasOfficialStructure(argument, method, expand_path);
                }
                break;
            }
            case "popcap_unofficial_atlas_split": {
                if (Array.isArray(argument)) {
                    const method: "id" | "path" =
                        (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                            Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_method"),
                            [1, 2],
                            {
                                "1": [
                                    Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_id"),
                                    Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_id"),
                                ],
                                "2": [
                                    Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_path"),
                                    Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_path"),
                                ],
                            },
                            `${MainScriptDirectory}/modules/customization/methods/popcap_atlas_split.json`,
                            `method`
                        ) as 1 | 2) === 2
                            ? "path"
                            : "id";
                    Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.ExtractUnofficialPvZ2Atlas.ExtractPvZ2AtlasUnofficialStructure(argument, method);
                }
                break;
            }
            case "popcap_unofficial_atlas_merge": {
                if (!Array.isArray(argument)) {
                    const destination: Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.AtlasMergeInputRequirement =
                        Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputAtlasMerge();
                    Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackFromAtlasJson.PackForUnofficialSubgroupStructure(argument, destination);
                } else {
                    argument.forEach((arg: string) => {
                        const destination: Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.AtlasMergeInputRequirement =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputAtlasMerge();
                        Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackFromAtlasJson.PackForUnofficialSubgroupStructure(arg, destination);
                    });
                }
                break;
            }
            case "popcap_official_pam_to_pam_json": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.pam.json`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationToAnimationJson(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.pam.json`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationToAnimationJson(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_official_pam_to_flash_animation": {
                if (!Array.isArray(argument)) {
                    const resolution: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                        Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation"),
                        `${MainScriptDirectory}/modules/customization/methods/popcap_animation.json`,
                        `resolution`
                    );
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.xfl`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationToAnimateAdobeFlashAnimation(argument, output_argument, resolution);
                } else {
                    argument.forEach((arg: string) => {
                        const resolution: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                            Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation"),
                            `${MainScriptDirectory}/modules/customization/methods/popcap_animation.json`,
                            `resolution`
                        );
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.xfl`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationToAnimateAdobeFlashAnimation(arg, output_argument, resolution);
                    });
                }
                break;
            }
            case "popcap_official_pam_json_to_pam": {
                if (!Array.isArray(argument)) {
                    Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                        Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(argument)
                    );
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(Path.Parse(argument).name_without_extension).name_without_extension}.pam`
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationJsonToAnimation(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(arg)
                        );
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(Path.Parse(arg).name_without_extension).name_without_extension}.pam`
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationJsonToAnimation(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_sprite_resize": {
                if (!Array.isArray(argument)) {
                    const original: 1536 | 768 | 384 | 640 | 1200 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                        Sen.Script.Modules.System.Default.Localization.GetString("popcap_sprite_resize_original_res"),
                        `${MainScriptDirectory}/modules/customization/methods/popcap_sprite_resize.json`,
                        `original_res`
                    );
                    const modified: 1536 | 768 | 384 | 640 | 1200 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                        Sen.Script.Modules.System.Default.Localization.GetString("popcap_sprite_resize_output_res"),
                        `${MainScriptDirectory}/modules/customization/methods/popcap_sprite_resize.json`,
                        `output_res`
                    );
                    const output_argument: string = Path.Resolve(argument.replace(original.toString(), modified.toString()));
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Resize.ResizePopCapSprite.DoAllResizeBasedOnAtlasJson(
                        argument,
                        original,
                        modified,
                        output_argument
                    );
                } else {
                    argument.forEach((arg: string) => {
                        const original: 1536 | 768 | 384 | 640 | 1200 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                            Sen.Script.Modules.System.Default.Localization.GetString("popcap_sprite_resize_original_res"),
                            `${MainScriptDirectory}/modules/customization/methods/popcap_sprite_resize.json`,
                            `original_res`
                        );
                        const modified: 1536 | 768 | 384 | 640 | 1200 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                            Sen.Script.Modules.System.Default.Localization.GetString("popcap_sprite_resize_output_res"),
                            `${MainScriptDirectory}/modules/customization/methods/popcap_sprite_resize.json`,
                            `output_res`
                        );
                        const output_argument: string = Path.Resolve(arg.replace(original.toString(), modified.toString()));
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Resize.ResizePopCapSprite.DoAllResizeBasedOnAtlasJson(
                            arg,
                            original,
                            modified,
                            output_argument
                        );
                    });
                }
                break;
            }
            case "popcap_official_pam_json_from_flash_animation": {
                if (!Array.isArray(argument)) {
                    Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                        Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(argument)
                    );
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.pam.json`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Animation.AnimateAdobeFlashAnimationToPopCapAnimationJson(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(arg)
                        );
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.pam`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.AnimateAdobeFlashAnimationToPopCapAnimationJson(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_official_pam_json_to_flash_animation": {
                if (!Array.isArray(argument)) {
                    Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                        Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(argument)
                    );
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.xfl`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    const resolution: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                        Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation"),
                        `${MainScriptDirectory}/modules/customization/methods/popcap_animation.json`,
                        `resolution`
                    );
                    Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationJsonToAnimateAdobeFlashAnimation(argument, output_argument, resolution);
                } else {
                    argument.forEach((arg: string) => {
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(arg)
                        );
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.xfl`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        const resolution: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                            Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation"),
                            `${MainScriptDirectory}/modules/customization/methods/popcap_animation.json`,
                            `resolution`
                        );
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationJsonToAnimateAdobeFlashAnimation(arg, output_argument, resolution);
                    });
                }
                break;
            }
            default: {
                throw new Sen.Script.Modules.Exceptions.RuntimeError(
                    Sen.Script.Modules.System.Default.Localization.GetString("function_not_found").replace(/\{\}/g, function_name),
                    Sen.Script.Modules.Interface.Assert.function_json_location
                ) as never;
            }
        }
        const func_time_end: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        const time_spent: string = Sen.Script.Modules.System.Default.Timer.CalculateTime(func_time_start, func_time_end, 3);
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_time").replace(/\{\}/g, time_spent)
        );
        if (Sen.Script.Modules.System.Default.Localization.notification) {
            DotNetPlatform.SendNotification(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(
                    Sen.Script.Modules.System.Default.Localization.GetString("toast_notification_message"),
                    [Sen.Script.Modules.System.Default.Localization.GetString(function_name), time_spent]
                ),
                `Sen`
            );
        }
        return;
    }
}
