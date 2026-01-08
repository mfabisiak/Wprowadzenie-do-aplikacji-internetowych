package io.github.mfabisiak.wdai

import io.github.mfabisiak.wdai.util.validBookId
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.auth.authenticate
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

        authenticate {
            post("/api/orders") {
                val newOrder = try {
                    call.receive<ExposedOrder>()
                } catch (_: ContentTransformationException) {
                    call.respond(HttpStatusCode.BadRequest, "Invalid request content")
                    return@post
                }

                if (!validBookId(newOrder.bookId)) {
                    call.respond(HttpStatusCode.NotFound, "Book with ID ${newOrder.bookId} does not exist")
                    return@post
                }


                val orderId = ordersService.placeOrder(newOrder)

                call.respond(HttpStatusCode.Created, orderId)
            }

            delete("/api/orders/{orderId}") {
                val orderId =
                    call.parameters["orderId"]?.toInt() ?: throw IllegalArgumentException("Order ID not provided")

                val result = ordersService.deleteOrder(orderId)

                if (result == 0) {
                    call.respond(HttpStatusCode.NotFound, "Order with ID $orderId does not exist")
                    return@delete
                }

                call.respond(HttpStatusCode.OK)
            }

            patch("/api/orders") {
                val receivedOrder = try {
                    call.receive<NullableOrder>()
                } catch (_: ContentTransformationException) {
                    call.respond(HttpStatusCode.BadRequest, "Invalid request content")
                    return@patch
                }

                val order = ordersService.getOrderById(receivedOrder.id)

                if (order == null) {
                    call.respond(HttpStatusCode.NotFound, "Order with ID ${receivedOrder.id} does not exist")
                    return@patch
                }

                if (receivedOrder.bookId != null && !validBookId(receivedOrder.bookId)) {
                    call.respond(HttpStatusCode.NotFound, "Book with ID ${receivedOrder.bookId} does not exist")
                    return@patch
                }

                val newOrder = order update receivedOrder

                ordersService.updateOrder(receivedOrder.id, newOrder)

                call.respond(HttpStatusCode.OK)
            }
        }
    }
}