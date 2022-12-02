const Redis = require("ioredis");
let redisClient = new Redis(
  "redis://default:a1e07c7df6b2437b9005d2a631d72b7d@eu2-driving-swine-30169.upstash.io:30169"
);

module.exports = redisClient;
// const user = {
//   name: "Bob",
//   // The field of a Redis Hash key can only be a string.
//   // We can write `age: 20` here but ioredis will convert it to a string anyway.
//   age: "25",
//   description: "I am a programmer",
// };
// async function test() {
//   const new_user = {
//     username: "thichkhach13",
//     password: "14121502",
//     email: "n.christian345@gmail.com",
//     date: new Date(),
//   };
//   try {
//     const id = await redisClient.hget("users", new_user.username);
//     if (id !== null) {
//       console.log("Username unavailable");
//       return;
//     } else {
//       const user_id = await redisClient.incr("new_user_id");
//       await redisClient.hmset("user:" + user_id, new_user);
//       await redisClient.hset("users", new_user.username, user_id);
//     }
//     console.log("ok");
//   } catch (error) {}

//   return;
// }

// test();
