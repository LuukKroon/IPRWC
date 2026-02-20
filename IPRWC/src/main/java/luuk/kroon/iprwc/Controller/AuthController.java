package luuk.kroon.iprwc.Controller;

import luuk.kroon.iprwc.Model.User;
import luuk.kroon.iprwc.Repository.UserRepository;
import luuk.kroon.iprwc.Service.JwtService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Gebruikersnaam is niet beschikbaar."));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setRole("ROLE_USER");

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Gebruiker succesvol geregistreerd!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        Optional<User> userOptional = userRepository.findByUsername(loginUser.getUsername());

        if (userOptional.isEmpty() || !passwordEncoder.matches(loginUser.getPassword(), userOptional.get().getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Ongeldige gebruikersnaam of wachtwoord."));
        }

        User user = userOptional.get();
        String token = jwtService.generateToken(user);

        ResponseCookie springCookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(10 * 60 * 60)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, springCookie.toString())
                .body(Map.of(
                        "username", user.getUsername(),
                        "role", user.getRole()
                ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie springCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, springCookie.toString())
                .body(Map.of("message", "Succesvol uitgelogd"));
    }
}