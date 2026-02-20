package luuk.kroon.iprwc.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank; 
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime orderDate;
    private double totalPrice;

    @NotBlank(message = "Straat is verplicht")
    private String straat;

    @NotBlank(message = "Huisnummer is verplicht")
    private String huisnummer;

    @NotBlank(message = "Postcode is verplicht")
    private String postcode;

    @NotBlank(message = "Stad is verplicht")
    private String stad;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items = new ArrayList<>();
}