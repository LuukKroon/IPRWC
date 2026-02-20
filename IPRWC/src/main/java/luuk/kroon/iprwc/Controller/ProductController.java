package luuk.kroon.iprwc.Controller;

import luuk.kroon.iprwc.Model.Product;
import luuk.kroon.iprwc.Repository.CategoryRepository;
import luuk.kroon.iprwc.Repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductController(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam("query") String query) {
        return productRepository.findByNaamContainingIgnoreCase(query);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id) {
        Optional<Product> productOpt = productRepository.findById(id);

        if (productOpt.isPresent() && productOpt.get().getImage() != null) {
            Product product = productOpt.get();
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(product.getImageType()))
                    .body(product.getImage());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProductWithImage(
            @RequestParam("naam") String naam,
            @RequestParam("beschrijving") String beschrijving,
            @RequestParam("prijs") double prijs,
            @RequestParam("image") MultipartFile file,
            @RequestParam(value = "categoryId", required = false) Long categoryId
    ) {
        if (naam == null || naam.trim().isEmpty() || beschrijving == null || beschrijving.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Naam en beschrijving zijn verplicht."));
        }
        if (prijs < 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Prijs mag niet negatief zijn."));
        }

        if (file.isEmpty() || file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Ongeldig bestand. Alleen afbeeldingen zijn toegestaan."));
        }

        Product product = new Product();
        product.setNaam(naam);
        product.setBeschrijving(beschrijving);
        product.setPrijs(prijs);

        try {
            product.setImage(file.getBytes());
            product.setImageName(file.getOriginalFilename());
            product.setImageType(file.getContentType());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Er is een fout opgetreden bij het verwerken van de afbeelding."));
        }

        if (categoryId != null) {
            categoryRepository.findById(categoryId).ifPresent(product::setCategory);
        }

        return ResponseEntity.ok(productRepository.save(product));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam("naam") String naam,
            @RequestParam("beschrijving") String beschrijving,
            @RequestParam("prijs") double prijs,
            @RequestParam(value = "image", required = false) MultipartFile file,
            @RequestParam(value = "categoryId", required = false) Long categoryId
    ) {
        if (naam == null || naam.trim().isEmpty() || beschrijving == null || beschrijving.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Naam en beschrijving zijn verplicht."));
        }
        if (prijs < 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Prijs mag niet negatief zijn."));
        }

        return productRepository.findById(id).map(product -> {
            product.setNaam(naam);
            product.setBeschrijving(beschrijving);
            product.setPrijs(prijs);

            if (file != null && !file.isEmpty()) {
                if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Ongeldig bestand. Alleen afbeeldingen zijn toegestaan."));
                }

                try {
                    product.setImage(file.getBytes());
                    product.setImageName(file.getOriginalFilename());
                    product.setImageType(file.getContentType());
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("message", "Er is een fout opgetreden bij het opslaan van de nieuwe afbeelding."));
                }
            }

            if (categoryId != null) {
                categoryRepository.findById(categoryId).ifPresent(product::setCategory);
            } else {
                product.setCategory(null);
            }

            return ResponseEntity.ok((Object) productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Product succesvol verwijderd."));
    }
}