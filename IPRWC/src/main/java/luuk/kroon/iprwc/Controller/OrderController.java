package luuk.kroon.iprwc.Controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import luuk.kroon.iprwc.DTO.OrderRequest;
import luuk.kroon.iprwc.Model.Order;
import luuk.kroon.iprwc.Model.OrderItem;
import luuk.kroon.iprwc.Model.Offer;
import luuk.kroon.iprwc.Model.Product;
import luuk.kroon.iprwc.Model.User;
import luuk.kroon.iprwc.Repository.OrderRepository;
import luuk.kroon.iprwc.Repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderController(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    private double calculateCurrentPrice(Product product) {
        if (product.getOffers() == null || product.getOffers().isEmpty()) {
            return product.getPrijs();
        }

        LocalDateTime now = LocalDateTime.now();
        for (Offer offer : product.getOffers()) {
            if (!now.isBefore(offer.getStartDatum()) && !now.isAfter(offer.getEindDatum())) {
                double discount = (product.getPrijs() * offer.getKortingsPercentage()) / 100.0;
                return product.getPrijs() - discount;
            }
        }
        return product.getPrijs();
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> placeOrder(@Valid @RequestBody OrderRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());

        order.setStraat(request.getStraat());
        order.setHuisnummer(request.getHuisnummer());
        order.setPostcode(request.getPostcode());
        order.setStad(request.getStad());

        double total = 0;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElse(null);

            if (product == null) {
                return ResponseEntity.badRequest().body("Een of meer producten uit het winkelmandje bestaan niet meer.");
            }

            double currentPrice = calculateCurrentPrice(product);

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(itemRequest.getQuantity());

            item.setPriceAtOrder(currentPrice);
            item.setOrder(order);

            order.getItems().add(item);
            total += (currentPrice * itemRequest.getQuantity());
        }

        order.setTotalPrice(total);
        return ResponseEntity.ok(orderRepository.save(order));
    }

    @GetMapping("/my-orders")
    public List<Order> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }
}