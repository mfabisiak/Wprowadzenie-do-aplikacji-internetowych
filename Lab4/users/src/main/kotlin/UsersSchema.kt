package io.github.mfabisiak

import kotlinx.coroutines.Dispatchers
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction

@Serializable
data class ExposedUser(val id: Int? = null, val email: String, val password: String)

class UserService(database: Database) {
    object Users : Table() {
        val id = integer("id").autoIncrement()
        val email = text("email")
        val password = text("password")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Users)
        }
    }

    suspend fun registerUser(newUser: ExposedUser): Int = dbQuery {
        Users.insert {
            it[email] = newUser.email
            it[password] = newUser.password
        }[Users.id]
    }

    suspend fun loginUser(user: ExposedUser): Boolean = dbQuery {
        Users.selectAll()
            .where {
                (Users.email eq user.email) and
                (Users.password eq user.password)
            }
            .count()
    } > 0



    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}

