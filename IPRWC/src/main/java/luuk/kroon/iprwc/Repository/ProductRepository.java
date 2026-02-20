package luuk.kroon.iprwc.Repository;

import luuk.kroon.iprwc.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByNaamContainingIgnoreCase(String naam);

    List<Product> findByPrijsLessThan(double prijs);
}