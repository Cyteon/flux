import Token from "./models/Token";
import User from "./models/User";

export async function verifyRequest(
    request: Request,
    cookies: any = null,
): Promise<any> {
    const authorization = request.headers.get("Authorization");

    let token: string | null = null;

    if (!authorization && (!cookies || !cookies.get("token"))) {
        return null;
    }

    if (authorization) {
        const parts = authorization.split(" ");

        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
        }
    } else {
        token = cookies.get("token");
    }

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
