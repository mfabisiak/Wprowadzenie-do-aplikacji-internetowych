package io.github.mfabisiak.wdai

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.request.ContentTransformationException
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.patch
import io.ktor.server.routing.post
import io.ktor.server.routing.routing
import org.jetbrains.exposed.sql.Database

fun Application.configureRouting(database: Database) {
    val booksService = BooksService(database)
    routing {

        get("/api/books/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
            val book = booksService.read(id)
            println(id)
            println(book)
            if (book != null) {
                call.respond(HttpStatusCode.OK, book)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }

        get("/api/books") {
            val books = booksService.readAll()
            call.respond(HttpStatusCode.OK, books)
        }

        post("/api/books") {
            val newBook = try {
                call.receive<ExposedBook>()
            } catch (_: ContentTransformationException) {
                call.respond(HttpStatusCode.BadRequest, "Invalid request content")
                return@post
            }

            val newId = booksService.create(newBook)

            call.respond(HttpStatusCode.OK, newId)
        }

        delete("/api/books/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("ID not provided")

            booksService.delete(id)
            call.respond(HttpStatusCode.OK, "Book of ID $id deleted.")

        }
    }
}