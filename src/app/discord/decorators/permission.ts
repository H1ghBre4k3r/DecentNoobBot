/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PermissionString, Message } from "discord.js";
import { AbstractCommand } from "../events/messages/commands/abstractCommand";

/**
 * Check, if the caller of the command is allowed to use it.
 *
 * @param permission permission, which is needed to execute the command
 */
export function Permission(
    permission: PermissionString
): (target: any, key: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor {
    // tslint:disable-next-line:only-arrow-functions
    return function (target: AbstractCommand, _key: string | symbol, run: PropertyDescriptor): PropertyDescriptor {
        const cmd: (...args: any) => void = run.value;
        target.restricted = true;
        run.value = async function (msg: Message): Promise<void> {
            // Check, if caller has a certain permission and execute function if so
            if (msg.member?.hasPermission(permission)) {
                cmd.apply(this, [msg]);
            }
        };
        return run;
    };
}
