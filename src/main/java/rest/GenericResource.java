package rest;

import java.io.InputStream;
import java.util.List;
import java.util.Random;

import org.glassfish.jersey.media.multipart.FormDataParam;

import jakarta.json.bind.JsonbBuilder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.Consumes;
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
    public Hangman newGame(@Context HttpServletRequest request) {
        String lang = request.getHeader("Accept-Language");
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream(String.format("words_%s.json", lang));
        List<String> list = JsonbBuilder.create().fromJson(inputStream, List.class);
        int i = new Random().nextInt(list.size());
        String s = list.get(i);
        Hangman game = new Hangman(s);
        HttpSession session = request.getSession();
        session.setAttribute("game", game);
        return game;
    }

    @PUT
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Hangman setLetter(@Context HttpServletRequest request, @FormDataParam("value") String msg) {
        HttpSession session = request.getSession();
        Hangman game = (Hangman) session.getAttribute("game");
        char c = msg.charAt(0);
        try {
            game.check(c);
            if (game.getWinner() == Winner.LOSE) {
                session.invalidate();
            }
        } catch (Exception e) {

        }
        return game;
    }
}
