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
            val title = call.parameters["title"] ?: throw IllegalArgumentException("Title not provided")
            val author = call.parameters["author"] ?: throw IllegalArgumentException("Author not provided")
            val year = call.parameters["year"]?.toInt() ?: throw IllegalArgumentException("Year not provided")

            val newId = booksService.create(ExposedBook(
                title = title,
                author = author,
                year = year
            ))

            call.respond(HttpStatusCode.OK, newId)
        }

        delete("/api/books/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("ID not provided")

            booksService.delete(id)
            call.respond(HttpStatusCode.OK, "Book of ID $id deleted.")

        }
    }
}