package io.github.mfabisiak.wdai

import kotlinx.coroutines.Dispatchers
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction

@Serializable
data class ExposedOrder(val id: Int? = null, val userId: Int, val bookId: Int, val quantity: Int = 1) {

    infix fun update(newOrder: NullableOrder): ExposedOrder = this.copy(
        userId = newOrder.userId ?: this.userId,
        bookId = newOrder.bookId ?: this.bookId,
        quantity = newOrder.quantity ?: this.quantity
    )
}

class OrdersService(database: Database) {
    object Orders : Table() {
        val id = integer("id").autoIncrement()
        val userId = integer("userId")
        val bookId = integer("bookId")
        val quantity = integer("quantity")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Orders)
        }
    }

    suspend fun placeOrder(order: ExposedOrder): Int = dbQuery {
        Orders.insert {
            it[userId] = order.userId
            it[bookId] = order.bookId
            it[quantity] = order.quantity
        }[Orders.id]
    }

    suspend fun getOrderById(id: Int): ExposedOrder? = dbQuery {
        Orders.selectAll()
            .where { Orders.id eq id }
            .map { ExposedOrder(it[Orders.id], it[Orders.userId], it[Orders.bookId], it[Orders.quantity]) }
            .singleOrNull()
    }

    suspend fun getOrdersByUserId(userId: Int): List<ExposedOrder> = dbQuery {
        Orders.selectAll()
            .where { Orders.userId eq userId }
            .map { ExposedOrder(it[Orders.id], it[Orders.userId], it[Orders.bookId], it[Orders.quantity]) }
    }

    suspend fun deleteOrder(id: Int) = dbQuery {
        Orders.deleteWhere { Orders.id eq id }
    }

    suspend fun updateOrder(id: Int, updatedOrder: ExposedOrder) = dbQuery {
        Orders.update({ Orders.id eq id }) {
            it[userId] = updatedOrder.userId
            it[bookId] = updatedOrder.bookId
            it[quantity] = updatedOrder.quantity
        }
    }




    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}

data class NullableOrder(val id: Int, val userId: Int?, val bookId: Int?, val quantity: Int?)

