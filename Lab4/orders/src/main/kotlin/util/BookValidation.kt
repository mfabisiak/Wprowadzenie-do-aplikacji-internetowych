package io.github.mfabisiak.wdai.util

import io.github.mfabisiak.wdai.httpClient
import io.ktor.client.request.*
import io.ktor.http.*

suspend fun validBookId(id: Int): Boolean {
    val response = httpClient.get("http://localhost:8080/api/books/$id")

    return response.status == HttpStatusCode.OK
}