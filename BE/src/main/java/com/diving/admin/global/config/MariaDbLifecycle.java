package com.diving.admin.global.config;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class MariaDbLifecycle implements BeanFactoryPostProcessor, DisposableBean {

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        run("start");
    }

    @Override
    public void destroy() {
        run("stop");
    }

    private void run(String action) {
        try {
            new ProcessBuilder("brew", "services", action, "mariadb")
                    .inheritIO()
                    .start()
                    .waitFor();
        } catch (IOException | InterruptedException e) {
            throw new IllegalStateException("Failed to " + action + " mariadb", e);
        }
    }
}
