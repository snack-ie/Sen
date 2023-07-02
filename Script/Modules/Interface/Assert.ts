namespace Sen.Script.Modules.Interface.Assert {
    /**
     *
     * @param argument - Assert functions
     * @returns
     */
    export function Evaluate(argument: Array<string>): void {
        // create debug directory
        Sen.Script.Modules.Interface.Assert.ProcessFunctionsJson();
        Sen.Script.Modules.Interface.Assert.CreateDebugDirectory();
        if (argument.length === 0) {
            Sen.Script.Modules.Interface.Assert.InputMorePath(argument);
        }
        let evaluate_more_argument: boolean = false;
        if (argument.length > 1) {
            evaluate_more_argument = EvaluateMoreArgument();
        }
        if (evaluate_more_argument) {
            PrintPath(argument, {
                current: argument.length,
                all: argument.length,
            });
            try {
                Sen.Script.Modules.Interface.Execute.ExecuteArgument(argument);
            } catch (error: unknown) {
                Sen.Script.Modules.Exceptions.PrintError<Error, string>(error);
            } finally {
            }
        } else {
            argument.forEach((arg: string, index: number) => {
                PrintPath(arg, {
                    current: index + 1,
                    all: argument.length,
                });
                try {
                    Sen.Script.Modules.Interface.Execute.ExecuteArgument(arg);
                } catch (error: unknown) {
                    Sen.Script.Modules.Exceptions.PrintError<Error, string>(error);
                } finally {
                }
            });
        }
        return;
    }

    /**
     * Function json
     */

    export interface FunctionJson {
        [x: string]: {
            func_number: number;
            include: Array<string>;
            exclude: Array<string>;
            type: Sen.Script.Modules.FileSystem.filter_file_type;
        };
    }

    /**
     * Function json file path
     */

    export const function_json_location: string = Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/Modules/Customization/functions.json`);

    /**
     * Deserialized function json
     */

    export const FunctionJsonObject: FunctionJson = Sen.Script.Modules.FileSystem.Json.ReadJson<FunctionJson>(Sen.Script.Modules.Interface.Assert.function_json_location);

    /**
     * All functions name
     */

    export const FunctionCollection: Array<string> = Object.keys(Sen.Script.Modules.Interface.Assert.FunctionJsonObject);

    /**
     * All functions number
     */

    export const FunctionNumbers: Array<int> = FunctionCollection.map((key: string) => Sen.Script.Modules.Interface.Assert.FunctionJsonObject[key].func_number);

    /**
     *
     * @returns Process function json
     */

    export function ProcessFunctionsJson(): void {
        for (let func of Sen.Script.Modules.Interface.Assert.FunctionCollection) {
            if (!("func_number" in FunctionJsonObject[func])) {
                throw new Sen.Script.Modules.Exceptions.RuntimeError(
                    `${Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("missing_in"), [`"func_number"`, `${func}`])}`,

                    Sen.Script.Modules.Interface.Assert.function_json_location
                );
            }
            if (!Number.isInteger(FunctionJsonObject[func].func_number)) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                        `func_number`,
                        `${func}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                        `${typeof FunctionJsonObject[func].func_number}`,
                    ]),
                    `func_number`,
                    function_json_location,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`
                );
            }
            if (!("type" in FunctionJsonObject[func])) {
                throw new Sen.Script.Modules.Exceptions.RuntimeError(
                    `${Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("missing_in"), [`"type"`, `${func}`])}`,

                    Sen.Script.Modules.Interface.Assert.function_json_location
                );
            }
            if (FunctionJsonObject[func].type !== "directory" && FunctionJsonObject[func].type !== "file" && FunctionJsonObject[func].type !== "unknown") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`type`, `${func}`, `directory or file or unknown`, `${typeof FunctionJsonObject[func].type}`]),
                    `type`,
                    function_json_location,
                    `directory or file or unknown`
                );
            }
            if (!("include" in FunctionJsonObject[func])) {
                throw new Sen.Script.Modules.Exceptions.RuntimeError(
                    `${Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("missing_in"), [`"include"`, `${func}`])}`,

                    Sen.Script.Modules.Interface.Assert.function_json_location
                );
            }
            if (!Array.isArray(FunctionJsonObject[func].include)) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                        `includes`,
                        `${func}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                        `${typeof FunctionJsonObject[func].include}`,
                    ]),
                    `resources`,
                    function_json_location,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`
                );
            }
            if (!("exclude" in FunctionJsonObject[func])) {
                throw new Sen.Script.Modules.Exceptions.RuntimeError(
                    `${Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("missing_in"), [`"exclude"`, `${func}`])}`,

                    Sen.Script.Modules.Interface.Assert.function_json_location
                );
            }
            if (!Array.isArray(FunctionJsonObject[func].exclude)) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                        `exclude`,
                        `${func}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                        `${typeof FunctionJsonObject[func].exclude}`,
                    ]),
                    `resources`,
                    function_json_location,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`
                );
            }
        }
        return;
    }

    /**
     *
     * @param argument - Pass argument here
     * @param size - Pass size
     * @returns
     */

    export function PrintPath(argument: Array<string> | string, size: { current: int; all: number }): void {
        if (Array.isArray(argument)) {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_in_progress").replace(/\{\}/g, `${size.current}/${size.all}`)}`);
            argument.forEach((arg: string) => Sen.Shell.Console.Printf(null, `      ${arg}`));
        } else {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_in_progress").replace(/\{\}/g, `${size.current}/${size.all}`)}`);
            Sen.Shell.Console.Printf(null, `      ${argument satisfies string}`);
        }
        return;
    }

    /**
     *
     * @returns If the user want to evaluate all arguments at one
     */

    export function EvaluateMoreArgument(): boolean {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("execute_all_argument_in_queue"))}`);
        return Sen.Script.Modules.Interface.Arguments.BooleanArgument() === 1;
    }

    /**
     *
     * @param input - Pass the input argument in
     * @param numbers - Pass the number array in
     * @returns number matched in the numbers[] else null
     */

    export function MatchInputWithNumbers(input: string, numbers: Array<number>): int | null {
        const numberRegex: RegExp = /^\d+$/;
        if (numberRegex.test(input)) {
            const inputNum: int = parseInt(input);
            if (numbers.includes(inputNum)) {
                return inputNum;
            }
        }
        return null;
    }

    /**
     *
     * @param argument - Pass the argument array to input more
     * @returns
     */
    export function InputMorePath(argument: Array<string>): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, ``)}`);
        Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("no_argument_were_passed")}`);
        let arg: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        while (arg !== "") {
            if (arg.endsWith(" ")) {
                arg = arg.slice(0, -1);
            }
            if ((arg.startsWith(`"`) && arg.endsWith(`"`)) || (arg.startsWith(`'`) && arg.endsWith(`'`))) {
                arg = arg.slice(1, -1);
            }
            if (Sen.Shell.FileSystem.FileExists(arg) || Sen.Shell.FileSystem.DirectoryExists(arg)) {
                argument.push(Sen.Shell.Path.Resolve(arg));
            } else {
                Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${Sen.Script.Modules.System.Default.Localization.GetString("no_such_file_or_directory").replace(/\{\}/g, arg)}`);
            }
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_size").replace(/\{\}/g, `${argument.length}`)}`);
            arg = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        }
        return;
    }

    export const debug_directory: string = Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Dirname(Sen.Shell.MainScriptDirectory)}/Debug`);

    /**
     *
     * @returns Create debug directory if not exists
     */

    export function CreateDebugDirectory(): void {
        if (!Sen.Shell.FileSystem.DirectoryExists(debug_directory)) {
            Sen.Shell.FileSystem.CreateDirectory(debug_directory);
        }
        return;
    }

    /**
     *
     * @param argument - Provide argument
     * @returns If contains, return true
     */

    export function CheckForJsonAndPng(argument: string[]): boolean {
        const jsonRegex: RegExp = /\.json$/i;
        const pngRegex: RegExp = /\.png$/i;
        let hasJson: boolean = false;
        let hasPng: boolean = false;

        for (const filePath of argument) {
            if (jsonRegex.test(filePath)) {
                hasJson = true;
            } else if (pngRegex.test(filePath)) {
                hasPng = true;
            }

            if (hasJson && hasPng) {
                return true;
            }
        }

        return false;
    }
}
