package servlets;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.List;
import java.util.Random;

import jakarta.json.bind.JsonbBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.Hangman;
import model.Winner;

@MultipartConfig
@WebServlet(name = "ServletForca", urlPatterns = { "/ServletForca" })
public class ServletForca extends HttpServlet {

    @SuppressWarnings("unchecked")
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        String lang = request.getParameter("value");
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream(String.format("words_%s.json", lang));
        List<String> list = JsonbBuilder.create().fromJson(inputStream, List.class);
        int i = new Random().nextInt(list.size());
        String s = list.get(i);
        Hangman game = new Hangman(s);
        HttpSession session = request.getSession();
        session.setAttribute("game", game);
        PrintWriter out = response.getWriter();
        out.print(JsonbBuilder.create().toJson(game));
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        HttpSession session = request.getSession();
        Hangman game = (Hangman) session.getAttribute("game");
        String letter = request.getParameter("value");
        PrintWriter out = response.getWriter();
        char c = letter.charAt(0);
        try {
            game.check(c);
        } catch (Exception e) {

        }
        if(game.getWinner() == Winner.LOSE) {
            session.invalidate();
        }
        out.print(JsonbBuilder.create().toJson(game));
    }
}
