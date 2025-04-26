import User from "$lib/models/User";
import Settings from "$lib/models/Settings.js";
import fs from "fs";
import { verifyRequest } from "$lib/api.server.js";

export async function POST({ request }) {
    const { path } = await request.json();

    if (!path) {
        return new Response(JSON.stringify({ error: "Path is missing" }), {
            status: 400,
        });
    }

    const userCount = await User.count();

    if (userCount > 0) {
        const user = await verifyRequest(request);

        if (!user || !user?.admin) {
            return new Response(
                JSON.stringify({
                    message: "Setup already completed",
                }),
                {
                    status: 400,
                },
            );
        }
    }

    const pathExists = fs.existsSync(path);

    if (!pathExists) {
        return new Response(
            JSON.stringify({
                error: "Path does not exist",
            }),
            {
                status: 400,
            },
        );
    }

    const pathStat = fs.statSync(path);

    if (!pathStat.isDirectory()) {
        return new Response(
            JSON.stringify({
                error: "Path is not a directory",
            }),
            {
                status: 400,
            },
        );
    }

    try {
        fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
        return new Response(
            JSON.stringify({
                error: "Path is not readable or writable",
            }),
            {
                status: 400,
            },
        );
    }

    const settings = await Settings.findByPk(1);

    if (settings) {
        await settings.update({
            mediaPath: path,
        });
    } else {
        await Settings.create({
            mediaPath: path,
        });
    }

    return Response.json({
        message: "Path is set",
    });
}
