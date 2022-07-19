package rest;

import java.io.InputStream;
import java.util.List;
import java.util.Random;

import jakarta.json.bind.JsonbBuilder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import model.Hangman;
import model.Winner;

@Path("hangman")
public class GenericResource {

    @SuppressWarnings("unchecked")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Hangman newGame(@Context HttpServletRequest request, Message msg) {
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream(String.format("words_%s.json", msg.getValue()));
        List<String> list = JsonbBuilder.create().fromJson(inputStream, List.class);
        int i = new Random().nextInt(list.size());
        String s = list.get(i);
        Hangman game = new Hangman(s);
        HttpSession session = request.getSession();
        session.setAttribute("game", game);
        return game;
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    public Hangman setLetter(@Context HttpServletRequest request, Message msg) {
        HttpSession session = request.getSession();
        Hangman game = (Hangman) session.getAttribute("game");
        char c = msg.getValue().charAt(0);
        try {
            game.check(c);
        } catch (Exception e) {

        }
        if(game.getWinner() == Winner.LOSE) {
            session.invalidate();
        }
        return game;
    }
}
