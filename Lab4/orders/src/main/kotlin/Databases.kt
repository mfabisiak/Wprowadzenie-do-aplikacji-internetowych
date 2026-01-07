package io.github.mfabisiak.wdai

import io.ktor.server.application.*
import org.jetbrains.exposed.sql.*

fun Application.configureDatabases(): Database {
    val dbPath = java.io.File("../database.db").absolutePath
    return  Database.connect(
        url = "jdbc:sqlite:$dbPath",
        driver = "org.sqlite.JDBC",
    )

}
