package model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Hangman {

    private final List<Character> word;
    private final List<Character> triedChars;
    private final List<Character> wrongChars;
    private final List<Character> maskedWord;
    private final int WRONG_TRIES = 6;
    private Winner winner;

    public Hangman(String _word) {
        this.word = _word.toUpperCase().chars().mapToObj(e -> (char) e).collect(Collectors.toList());
        this.triedChars = new ArrayList<>();
        this.wrongChars = new ArrayList<>();
        this.maskedWord = new ArrayList<>();
        for (int i = 0; i < this.word.size(); i++) {
            this.maskedWord.add((this.word.get(i) == ' ') ? ' ' : (this.word.get(i) == '-') ? '-' : '_');
        }
    }

    public void check(char l) {
        char letter = Character.toUpperCase(l);
        if (letter < 'A' || letter > 'Z') {
            throw new IllegalArgumentException("Type a valid character.");
        }
        if (this.triedChars.stream().anyMatch(c -> c == letter)) {
            throw new IllegalArgumentException("This character was already pressed.");
        }
        this.triedChars.add(letter);
        this.maskedWord.clear();
        for (int i = 0; i < this.word.size(); i++) {
            char c = this.word.get(i);
            this.maskedWord.add(this.triedChars.contains(c) ? c : '_');
        }
        if (this.word.stream().anyMatch(c -> c == letter)) {
            if (this.maskedWord.stream().allMatch(c -> c != '_')) {
                this.winner = Winner.WIN;
                return;
            }
            this.winner = Winner.CORRECT_LETTER;
            return;
        }
        this.wrongChars.add(letter);
        if (this.wrongChars.size() == WRONG_TRIES) {
            this.winner = Winner.LOSE;
            return;
        }
        this.winner = Winner.WRONG_LETTER;
    }

    public List<Character> getWrongChars() {
        return this.wrongChars;
    }

    public List<Character> getWord() {
        return this.winner == Winner.LOSE ? this.word : this.maskedWord;
    }

    public Winner getWinner() {
        return winner;
    }
}
