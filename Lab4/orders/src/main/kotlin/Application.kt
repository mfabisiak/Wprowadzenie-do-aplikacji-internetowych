package io.github.mfabisiak.wdai

import io.ktor.client.HttpClient
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation as ServerContentNegotiation
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*

val httpClient = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    monitor.subscribe(ApplicationStopping) {
        httpClient.close()
    }
    configureSecurity()
    val database = configureDatabases()
    configureRouting(database)
    install(ServerContentNegotiation) {
        json()
    }
}

