const { User, Thought } = require("../models");

const thoughtController = {
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find({}).select("-__v");
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleThought({ params }, res) {
    try {
      const thought = await Thought.findOne({ _id: params.id }).select("-__v");
      if (thought) {
        res.json(thought);
      } else {
        res.status(404).json({ message: "No thought with this ID" });
        return;
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );
      if (!updatedUser) {
        return res
          .status(404)
          .json({ message: "Thought created, but found no user with this ID" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateThought({ params, body }, res) {
    try {
      const thought = await Thought.findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true,
      }).select("-__v");
      if (thought) {
        res.json(thought);
      } else {
        res.status(404).json({ message: "No thought with this ID" });
        return;
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.id });
      if (thought) {
        res.json(thought);
      } else {
        res.status(404).json({ message: "No thought with this ID" });
        return;
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createReaction({ params, body }, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true }
      ).select("-__v");
      if (reaction) {
        res.json(reaction);
      } else {
        res.status(404).json({ message: "No thought with this ID" });
        return;
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeReaction({ params }, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      ).select("-__v");

      if (updatedThought) {
        res.json(updatedThought);
      } else {
        res.status(404).json({ message: "No thought with this ID" });
        return;
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;
