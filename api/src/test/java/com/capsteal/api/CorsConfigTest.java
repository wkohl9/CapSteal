package com.capsteal.api;

import com.capsteal.api.config.CorsConfig;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatCode;

/** Plain unit test: needs no database, so CI can run it without Postgres. */
class CorsConfigTest {

    @Test
    void acceptsCommaSeparatedOrigins() {
        assertThatCode(() -> new CorsConfig("http://localhost:5173, https://capsteal.vercel.app"))
                .doesNotThrowAnyException();
    }
}
