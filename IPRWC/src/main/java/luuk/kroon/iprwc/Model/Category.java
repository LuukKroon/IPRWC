package luuk.kroon.iprwc.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Categorienaam is verplicht")
    private String naam;

    private String beschrijving;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Product> products;
}