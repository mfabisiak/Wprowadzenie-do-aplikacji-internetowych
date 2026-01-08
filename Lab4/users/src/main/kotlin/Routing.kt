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

fun Application.configureRouting(database: Database) {
    val userService = UserService(database)

    routing {
        post("/api/register") {
            val newUser = try {
                call.receive<ExposedUser>()
            } catch (_: ContentTransformationException) {
                call.respond(HttpStatusCode.BadRequest, "Invalid request content")
                return@post
            }

            val userId = userService.registerUser(newUser)

            call.respond(HttpStatusCode.OK, userId)
        }

        post("/api/login") {
            val user = try {
                call.receive<ExposedUser>()
            } catch (_: ContentTransformationException) {
                call.respond(HttpStatusCode.BadRequest, "Invalid request content")
                return@post
            }

            val userId = userService.loginUser(user)

            if (userId == null) {
                call.respond(HttpStatusCode.Unauthorized, "Wrong email or password")
                return@post
            }

            val token = createToken(userId)

            call.respond(mapOf("token" to token))
        }

        authenticate {
            get("/api/secret") {
                call.respondText("Hello")
            }
        }
    }
}
