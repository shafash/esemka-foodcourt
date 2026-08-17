const isProduction = process.env.NODE_ENV === "production";

export const AUTH_COOKIE_NAME = "token";
export const CSRF_COOKIE_NAME = "csrfToken";

const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function setAuthCookies(res, { token, csrfToken }) {
    res.cookie(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: AUTH_COOKIE_MAX_AGE_MS,
        path: "/",
    });

    res.cookie(CSRF_COOKIE_NAME, csrfToken, {
        httpOnly: false,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: AUTH_COOKIE_MAX_AGE_MS,
        path: "/",
    });
}

export function clearAuthCookies(res) {
    res.clearCookie(AUTH_COOKIE_NAME, { path: "/" });
    res.clearCookie(CSRF_COOKIE_NAME, { path: "/" });
}