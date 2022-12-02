// const LocalStrategy = require("passport-local").Strategy;

// const redisClient = require(path.join(__dirname, "./redis"));
// const bcrypt = require("bcrypt");

// module.exports = async function (passport) {
//   passport.use(
//     new LocalStrategy(
//       {
//         usernameField: "email",
//       },
//       async (email, password, done) => {
//         try {
//           const user_id = await redisClient.hget("users", email);
//   if (!user_id) {
//     return done(null, false, { message: "User not found" });
//   }

//           const stored_password = await redisClient.hget(
//             "user:" + user_id,
//             "password"
//           );
//           if (!stored_password)
//             return done(null, false, { message: "Password not found" });

//           const matched = await bcrypt.compare(password, stored_password);
//           if (!matched) {
//             return done(null, false, {
//               message: "Passwords incorrect",
//             });
//           }

//           const final_user = JSON.parse(
//             await redisClient.hget("user:" + user_id)
//           );

//           return done(null, final_user);
//         } catch (error) {
//           console.log(error.message);
//         }
//       }
//     )
//   );
// };
