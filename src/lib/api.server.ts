import Token from "./models/Token";
import User from "./models/User";

export async function verifyRequest(request: Request): Promise<any> {
    const authorization = request.headers.get("Authorization");

    if (!authorization) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
        return null;
    }

    const tokenData = await Token.findOne({
        where: {
            token,
        },
    });

    if (!tokenData) {
        return null;
    }

    const user = await User.findByPk(tokenData.userId);

    if (!user) {
        return null;
    }

    return user;
}
