import { Alg } from "cubing/alg";
import { TwistyPlayer } from "cubing/twisty";
import { randomScrambleForEvent } from "cubing/scramble";

async function gen() {
  const scramble = await randomScrambleForEvent("clock");
  document.getElementById("genScramble").textContent = scramble.toString();
  return scramble.toString(); // Return the scramble for later use
}

async function setTwistyPlayerAlg() {
  const alg = await gen(); // Get the scramble from gen function
  const twistyPlayer = document.querySelector('twisty-player');
  twistyPlayer.setAttribute('alg', alg);
}

setTwistyPlayerAlg();
gen();