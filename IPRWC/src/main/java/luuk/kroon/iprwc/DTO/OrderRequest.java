package luuk.kroon.iprwc.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {

    @NotBlank(message = "Straat is verplicht")
    private String straat;

    @NotBlank(message = "Huisnummer is verplicht")
    private String huisnummer;

    @NotBlank(message = "Postcode is verplicht")
    private String postcode;

    @NotBlank(message = "Stad is verplicht")
    private String stad;

    @NotEmpty(message = "Winkelmandje mag niet leeg zijn")
    @Valid
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        @NotNull(message = "Product ID is verplicht")
        private Long productId;

        @Min(value = 1, message = "Aantal moet minimaal 1 zijn")
        private int quantity;
    }
}