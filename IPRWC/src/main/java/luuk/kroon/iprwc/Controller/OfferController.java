package luuk.kroon.iprwc.Controller;

import jakarta.validation.Valid;
import luuk.kroon.iprwc.Model.Offer;
import luuk.kroon.iprwc.Repository.OfferRepository;
import luuk.kroon.iprwc.Repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final OfferRepository offerRepository;
    private final ProductRepository productRepository;

    public OfferController(OfferRepository offerRepository, ProductRepository productRepository) {
        this.offerRepository = offerRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }

    @PostMapping("/product/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createOfferForProduct(@PathVariable Long productId, @Valid @RequestBody Offer offer) {
        if (offer.getEindDatum().isBefore(offer.getStartDatum())) {
            return ResponseEntity.badRequest().body("Einddatum mag niet voor de startdatum liggen.");
        }

        return productRepository.findById(productId).map(product -> {
            offer.setProduct(product);
            return ResponseEntity.ok((Object) offerRepository.save(offer));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOffer(@PathVariable Long id) {
        if (!offerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        offerRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}