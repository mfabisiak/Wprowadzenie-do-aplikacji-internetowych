package io.github.mfabisiak.wdai

import kotlinx.coroutines.Dispatchers
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import org.mindrot.jbcrypt.BCrypt


@Serializable
data class ExposedUser(val id: Int? = null, val email: String, val password: String)

class UserService(database: Database) {
    object Users : Table() {
        val id = integer("id").autoIncrement()
        val email = text("email").uniqueIndex()
        val password = text("password")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            arrayOf<Table>(Users)
            Unit
        }
    }

    suspend fun registerUser(newUser: ExposedUser): Int = dbQuery {
        val hashedPassword = BCrypt.hashpw(newUser.password, BCrypt.gensalt())
        Users.insert {
            it[email] = newUser.email
            it[password] = hashedPassword
        }[Users.id]
    }

    suspend fun loginUser(user: ExposedUser) = dbQuery {
        val userFromDB = Users.selectAll()
            .where { Users.email eq user.email }
            .singleOrNull() ?: return@dbQuery null

        val hash = userFromDB[Users.password]

        return@dbQuery if (BCrypt.checkpw(user.password, hash)) userFromDB[Users.id] else null
    }



    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}

