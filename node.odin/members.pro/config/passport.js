const passport = require("passport");
// Loads Passport — the authentication middleware

const LocalStrategy = require("passport-local").Strategy;
// LocalStrategy = the strategy that checks username + password

const bcrypt = require("bcryptjs");
// Must match what's in package.json: "bcryptjs"

const prisma = require("./prisma");
// Loads your Prisma client to query the database


passport.serializeUser((user, done) => {
    // serializeUser runs after a successful login
    // It decides what to store in the session — just the user's id (not the whole object)
    // Storing only the id keeps the session small and secure

    done(null, user.id);
    // "done" is Passport's callback: done(error, dataToStore)
    // null = no error, user.id = what gets saved in the session cookie
});

// ── deserializeUser ───────────────────────────────────────
passport.deserializeUser(async (id, done) => {
    // This runs on EVERY request for logged-in users
    // Passport reads the id from the session and uses it to fetch the full user

    try {
        const user = await prisma.user.findUnique({ where: { id } });
        // Fetches the user from the database using the id stored in the session
        // { where: { id } } is shorthand for { where: { id: id } }

        done(null, user);
        // Attaches the user object to req.user on every request
        // This is why you can access req.user in all your routes
    } catch (err) {
        done(err);
        // If the DB query fails, pass the error to Passport
    }
});

// ── LocalStrategy (login logic) ───────────────────────────
passport.use(
    new LocalStrategy(async (username, password, done) => {
        // This function runs when POST /auth/login is submitted
        // "username" = whatever was in the "username" field of the login form
        // "password" = the password field
        // "done" = callback to tell Passport what happened

        try {
            const user = await prisma.user.findUnique({
                where: { email: username },
                // Looks up the user by email (we treat the username field as email)
                // This works because login.ejs has name="username" for the email input
                // If you want the field named "email" instead, add:
                // usernameField: "email" in the LocalStrategy options
            });

            if (user === null) return done(null, false);
            // If no user found with that email → login fails
            // done(null, false) = no error, but authentication failed

            const match = await bcrypt.compare(password, user.password);
            // Compares the plain text password the user typed
            // with the hashed password stored in the database
            // bcrypt handles the hashing internally — returns true or false

            if (!match) return done(null, false);
            // Passwords don't match → login fails

            return done(null, user);
            // Everything checks out → login succeeds
            // Passport will call serializeUser with this user object

        } catch (err) {
            return done(err);
            // Something went wrong with the DB query → pass error to Passport
        }
    })
);

module.exports = passport;
// Exports the configured passport instance
// This is what authRout.js imports and uses for passport.authenticate()