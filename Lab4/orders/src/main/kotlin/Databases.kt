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
import kotlinx.serialization.MissingFieldException
import kotlinx.serialization.internal.throwMissingFieldException
import org.h2.engine.User
import org.jetbrains.exposed.sql.*
import io.ktor.client.request.*
import kotlin.jvm.java

fun Application.configureDatabases() {
    val dbPath = java.io.File("../database.db").absolutePath
    val database = Database.connect(
        url = "jdbc:sqlite:$dbPath",
        driver = "org.sqlite.JDBC",
    )

    val ordersService = OrdersService(database)
    routing {
        get("/api/orders/byUserId/{userId}") {
            val userId = call.parameters["userId"]?.toInt() ?: throw IllegalArgumentException("User ID not provided")

            val orders = ordersService.getOrdersByUserId(userId)

            call.respond(HttpStatusCode.OK, orders)
        }

        get("/api/orders/byOrderId/{orderId}") {
            val orderId = call.parameters["orderId"]?.toInt() ?: throw IllegalArgumentException("Order ID not provided")

            val order = ordersService.getOrderById(orderId)

            if (order == null)
            {
                call.respond(HttpStatusCode.NotFound)
                return@get
            }

            call.respond(HttpStatusCode.OK, order)

        }

        post("/api/orders") {
            val userId = call.parameters["userId"]?.toInt() ?: throw IllegalArgumentException("User ID not provided")
            val bookId = call.parameters["bookId"]?.toInt() ?: throw IllegalArgumentException("Book ID not provided")
            val quantity = call.parameters["quantity"]?.toInt() ?: 1



            val orderId = ordersService.placeOrder(ExposedOrder(
                userId = userId,
                bookId = bookId,
                quantity = quantity
            ))

            call.respond(HttpStatusCode.OK, orderId)
        }

        delete("/api/orders/{orderId}") {
            val orderId = call.parameters["orderId"]?.toInt() ?: throw IllegalArgumentException("Order ID not provided")

            val result = ordersService.deleteOrder(orderId)

            if (result == 0) {
                call.respond(HttpStatusCode.BadRequest, "Order with ID $orderId does not exist")
                return@delete
            }

            call.respond(HttpStatusCode.OK)
        }

        patch("api/orders") {
            val orderId = call.parameters["orderId"]?.toInt() ?: throw IllegalArgumentException("Order ID not provided")
            val newUserId: Int? = call.parameters["userId"]?.toInt()
            val newBookId: Int? = call.parameters["bookId"]?.toInt()
            val newQuantity: Int? = call.parameters["quantity"]?.toInt()

            val order = ordersService.getOrderById(orderId)

            if (order == null) {
                call.respond(HttpStatusCode.BadRequest, "Order with ID $orderId does not exist")
                return@patch
            }

            val newOrder = order.copy(
                userId = newUserId ?: order.userId,
                bookId = newBookId ?: order.bookId,
                quantity = newQuantity ?: order.quantity
            )

            ordersService.updateOrder(orderId, newOrder)

            call.respond(HttpStatusCode.OK)
        }
    }
}
