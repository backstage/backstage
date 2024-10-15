package ${{values.package_name}};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        System.out.println("This is called ${{values.name}}");
        SpringApplication.run(Application.class, args);
    }
}
