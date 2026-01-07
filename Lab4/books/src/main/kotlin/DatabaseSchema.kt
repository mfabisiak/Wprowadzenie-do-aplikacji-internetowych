package io.github.mfabisiak.wdai

import kotlinx.coroutines.Dispatchers
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction

@Serializable
data class ExposedBook(val id: Int? = null, val title: String, val author: String, val year: Int)

class BooksService(database: Database) {
    object Books : Table() {
        val id = integer("id").autoIncrement()
        val title = text("title")
        val author = text("author")
        val year = integer("year")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Books)
        }
    }

    suspend fun create(book: ExposedBook): Int = dbQuery {
        Books.insert {
            it[title] = book.title
            it[author] = book.author
            it[year] = book.year
        }[Books.id]
    }

    suspend fun read(id: Int): ExposedBook? = dbQuery {
            Books.selectAll()
                .where { Books.id eq id }
                .map { ExposedBook(it[Books.id], it[Books.title], it[Books.author], it[Books.year]) }
                .singleOrNull()
    }

    suspend fun readAll(): List<ExposedBook> = dbQuery {
            Books.selectAll()
                .map { ExposedBook(it[Books.id], it[Books.title], it[Books.author], it[Books.year]) }
    }

    suspend fun delete(id: Int) = dbQuery {
        Books.deleteWhere {Books.id eq id}
    }


    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}

