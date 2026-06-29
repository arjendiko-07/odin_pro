const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { sql, poolPromise } = require("./db");

passport.serializeUser((user, done) => {
    done(null, user.Id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("Id", sql.Int, id)
            .query("SELECT * FROM users WHERE Id = @Id");

        done(null, result.recordset[0] || null);
    } catch (err) {
        done(err);
    }
});

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input("Email", sql.NVarChar, username)
                .query("SELECT * FROM users WHERE Email = @Email");

            const user = result.recordset[0];
            if (!user) return done(null, false);

            const match = await bcrypt.compare(password, user.PasswordHash);
            if (!match) return done(null, false);

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

module.exports = passport;