package luuk.kroon.iprwc.Repository;

import luuk.kroon.iprwc.Model.Order;
import luuk.kroon.iprwc.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByOrderDateDesc(User user);

    List<Order> findAllByOrderByOrderDateDesc();
}