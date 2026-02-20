package luuk.kroon.iprwc.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1) @Max(99)
    private int kortingsPercentage;

    @NotNull
    private LocalDateTime startDatum;

    @NotNull
    private LocalDateTime eindDatum;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore 
    private Product product;
}