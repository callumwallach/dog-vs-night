export default {
  default: {
    character: "dog",
    title: "Dog vs Night",
    loading: [
      { fontSize: 3, message: "Dog vs Night", position: -20 },
      {
        fontSize: 1,
        message: "Battle the forces of darkness",
        position: +45,
      },
      {
        fontSize: 1,
        message: "triumph over the Grim Reaper himself!!",
        position: +95,
      },
    ],
    end: {
      success: [
        {
          fontSize: 3.5,
          message: "Booyah!!!",
          position: -35,
        },
        {
          fontSize: 1,
          message: "What are the creatures of the night afraid of?...",
          position: +20,
        },
        {
          fontSize: 3,
          message: "YOU!!!",
          position: +110,
        },
      ],
      failure: [
        { fontSize: 3, message: "Game Over!", position: -30 },
        {
          fontSize: 1.2,
          message: "Love at first bite?... Nope", //Your skills are rather underwhelming...",
          position: +30,
        },
        {
          fontSize: 1.2,
          message: "Tap to try again",
          position: +75,
        },
      ],
    },
  },
  andrew: {
    character: "boy",
    title: "Andrew vs Father Time",
    loading: [
      { fontSize: 2, message: "Andrew vs Father Time", position: -20 },
      {
        fontSize: 0.75,
        message:
          "As Andrew approaches his 50th the Grim Reaper offers a choice!!",
        position: +25,
      },
      {
        fontSize: 0.75,
        message: "Face him and triumph and he will turn back the clock!",
        position: +70,
      },
    ],
    end: {
      success: [
        { fontSize: 3, message: "Happy Birthday!!", position: -20 },
        { fontSize: 1.2, message: "Mid Life Crisis averted!", position: +30 },
        {
          fontSize: 1.2,
          message: "Your new age is 21!!",
          position: +75,
        },
      ],
      failure: [
        { fontSize: 3, message: "Game Over!", position: -20 },
        {
          fontSize: 1.2,
          message: "You tried, but you're still turning 50...",
          position: +30,
        },
      ],
    },
  },
  anya: {
    character: "girl",
    title: "Anya vs The Night",
    loading: [
      { fontSize: 2.5, message: "Anya vs The Night", position: -50 },
      {
        fontSize: 0.75,
        message: "It's Anya's birthday tomorrow... she will be 8",
        position: +10,
      },
      {
        fontSize: 0.75,
        message: "But first... she must battle the forces of the night!!",
        position: +50,
      },
      {
        fontSize: 1,
        message: "Will she survive and make it to her birthday??!!",
        position: +110,
      },
    ],
    end: {
      success: [
        { fontSize: 1.2, message: "You did it!!!", position: -115 },
        { fontSize: 3, message: "Happy Birthday Anya!!!", position: -20 },
        {
          fontSize: 1,
          message: "What are the creatures of the night afraid of?...",
          position: +30,
        },
        {
          fontSize: 3,
          message: "YOU!!!",
          position: +120,
        },
      ],
      failure: [
        { fontSize: 3, message: "Game Over!", position: -30 },
        {
          fontSize: 1.2,
          message: "Anya did not survive the night!!...",
          position: +30,
        },
        {
          fontSize: 1.2,
          message: "Guess we'll have to give her presents to Esme instead!!",
          position: +80,
        },
      ],
    },
  },
};
