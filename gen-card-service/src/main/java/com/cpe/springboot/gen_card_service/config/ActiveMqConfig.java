package com.cpe.springboot.gen_card_service.config;

import jakarta.jms.ConnectionFactory;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.config.DefaultJmsListenerContainerFactory;
import org.springframework.jms.core.JmsTemplate;

@Configuration
@EnableJms
public class ActiveMqConfig {

    @Value("${ACTIVEMQ_BROKER_URL}")
    private String brokerUrl;

    @Value("${spring.activemq.user:}")
    private String user;

    @Value("${spring.activemq.password:}")
    private String password;

    /**
     * 🔌 Connexion ActiveMQ
     */
    @Bean
    public ConnectionFactory connectionFactory() {
        ActiveMQConnectionFactory factory = new ActiveMQConnectionFactory();
        factory.setBrokerURL(brokerUrl);
        if (user != null && !user.isBlank()) {
            factory.setUserName(user);
            factory.setPassword(password);
        }
        return factory;
    }

    /**
     * 💬 Pour envoyer des messages vers ActiveMQ
     */
    @Bean
    public JmsTemplate jmsTemplate(ConnectionFactory connectionFactory) {
        return new JmsTemplate(connectionFactory);
    }

    /**
     * 👂 Configuration du listener JMS (consommation de messages)
     * Ajout d’un ErrorHandler et gestion de la concurrence
     */
    @Bean
    public DefaultJmsListenerContainerFactory jmsListenerContainerFactory(ConnectionFactory connectionFactory) {
        DefaultJmsListenerContainerFactory factory = new DefaultJmsListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setPubSubDomain(false); // false = Queue, true = Topic

        // 🧠 Évite les crashs en cas d'erreur dans le listener
        factory.setErrorHandler(t -> System.err.println("⚠️ Erreur JMS : " + t.getMessage()));

        // ⚙️ (Optionnel) Concurrence si plusieurs threads doivent consommer la queue
        factory.setConcurrency("1-3");

        return factory;
    }
}
