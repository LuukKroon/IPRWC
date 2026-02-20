package luuk.kroon.iprwc.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.util.List;

@Entity
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Productnaam is verplicht")
    @Size(min = 2, max = 100, message = "Naam moet tussen 2 en 100 tekens zijn")
    private String naam;

    @NotBlank(message = "Beschrijving is verplicht")
    @Size(max = 500, message = "Beschrijving mag max 500 tekens zijn")
    private String beschrijving;

    @Min(value = 0, message = "Prijs mag niet negatief zijn")
    private double prijs;

    private String imageName;
    private String imageType;

    @JsonIgnore
    @Column(columnDefinition = "bytea")
    private byte[] image;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Offer> offers;
}