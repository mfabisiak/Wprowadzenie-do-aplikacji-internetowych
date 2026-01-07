package io.github.mfabisiak.wdai

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.*

fun Application.configureDatabases() {
    val dbPath = java.io.File("../database.db").absolutePath
    val database = Database.connect(
        url = "jdbc:sqlite:$dbPath",
        driver = "org.sqlite.JDBC",
    )

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
