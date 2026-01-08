package io.github.mfabisiak.wdai

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.*

private const val jwtAudience = "library"
private const val jwtDomain = "http://localhost:8082/"
private const val jwtRealm = "library"
private const val jwtSecret = "very-secret-code"

fun Application.configureSecurity() {

    authentication {
        jwt {
            realm = jwtRealm
            verifier(
                JWT
                    .require(Algorithm.HMAC256(jwtSecret))
                    .withAudience(jwtAudience)
                    .withIssuer(jwtDomain)
                    .build()
            )
            validate { credential ->
                if (credential.payload.audience.contains(jwtAudience)) JWTPrincipal(credential.payload) else null
            }
        }
    }
}

fun createToken(userId: Int): String = JWT.create()
    .withAudience(jwtAudience)
    .withIssuer(jwtDomain)
    .withClaim("userId", userId)
    .sign(Algorithm.HMAC256(jwtSecret))
