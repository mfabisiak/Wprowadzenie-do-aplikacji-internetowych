package io.github.mfabisiak.wdai

import io.github.mfabisiak.wdai.util.validBookId
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.*

fun Application.configureDatabases(): Database {
    val dbPath = java.io.File("../database.db").absolutePath
    return  Database.connect(
        url = "jdbc:sqlite:$dbPath",
        driver = "org.sqlite.JDBC",
    )

}
