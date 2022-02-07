import db from "../db.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { stripHtml } from "string-strip-html";

export async function signUp(req, res) {
  const user = req.body;

  user.username = stripHtml(user.username).result.trim();
  user.email = stripHtml(user.email).result.trim();
  user.password = stripHtml(user.password).result;

  try {
    let registeredUser = await db
      .collection("users")
      .findOne({ email: user.email })
      .toArray();

    if (registeredUser) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await db.collection("users").insertOne({ ...user, password: passwordHash });

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  let { email, password } = req.body;

  email = stripHtml(email).result.trim();
  password = stripHtml(password).result;

  try {
    const user = await db.collection("users").findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();

      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });

      let userInfo = { ...user, token };

      delete userInfo.password;

      res.send(userInfo);
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
