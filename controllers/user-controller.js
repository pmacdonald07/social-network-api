const { User, Thought } = require("../models");

const userController = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find({}).select("-__v");
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleUser({ params }, res) {
    try {
      const user = await User.findOne({ _id: params.id })
        .populate({ path: "thoughts", select: "-__v" })
        .populate({ path: "friends", select: "-__v" })
        .select("-__v");
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "No user with this ID" });
        return;
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser({ params, body }, res) {
    try {
      const user = await User.findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true,
      }).select("-__v");
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "No user with this ID" });
        return;
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.id });
      // const deletedThoughts = await Thought.deleteMany({ username: user.username })
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "No user with this ID" });
        return;
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addFriend({ params }, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true }
      ).select("-__v");

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "No user with this ID" });
        return;
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeFriend({ params }, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      ).select("-__v");

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "No user with this ID" });
        return;
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
