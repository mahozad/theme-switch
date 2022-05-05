@file:JvmName("ChangelogGenerator")
@file:CompilerOptions("-jvm-target", "11")

import java.io.File

val inputFile = File("CHANGELOG.md")
val outputFile = File("changelog.txt")
val versionHeaderLineRegex = Regex(""".*v\d+\.\d+\.\d+.* \(\d{4}-\d{2}-\d{2}\)""")
val commitReferenceRegex = Regex("""\[`(?<hash>[\da-f]{8})`]\([^(]+\k<hash>/?\)""")
val issueReferenceRegex = Regex("""\[#(?<number>\d+)]\([^(]+/\k<number>/?\)""")

val result = buildString {
    val releaseType = determineTypeOfThisRelease()
    val header = "This is a $releaseType release."
    val body = createReleaseBody()
    appendLine(header)
    appendLine()
    append(body)
}

outputFile.writeText(result)

fun determineTypeOfThisRelease(): String {
    val (new, old) = getLastTwoVersionTags()
    val (newMajor, newMinor, _) = new.split(".")
    val (oldMajor, oldMinor, _) = old.split(".")
    return when {
        newMajor == "0" && newMinor > oldMinor -> "major"
        newMajor > oldMajor -> "major"
        newMinor > oldMinor -> "minor"
        else -> "patch"
    }
}

fun getLastTwoVersionTags() = inputFile
    .readLines()
    .filter { it matches versionHeaderLineRegex }
    .take(2)
    .map { it.substringBetween("v", " ") }

fun createReleaseBody() = inputFile
    .readLines()
    .dropWhile { !it.matches(versionHeaderLineRegex) }
    .dropWhile { it.matches(versionHeaderLineRegex) }
    .takeWhile { !it.matches(versionHeaderLineRegex) }
    .joinToString(separator = "\n")
    .cleanReferences()

/**
 * Remove links for commit SHAs and issues and pull requests
 * as GitHub automatically converts them to links.
 * Note that the GitHub links are visually different and also,
 * when hovering over them with mouse, a popup shows the commit/issue information.
 */
fun String.cleanReferences() = this
    .replace(commitReferenceRegex) { matchResult ->
        // FIXME: Replace with the following in Kotlin 1.7 and higher:
        //  matchResult.groups["hash"]?.value ?: error("Regex group not found")
        matchResult.groupValues[1]
    }
    .replace(issueReferenceRegex) { matchResult ->
        // FIXME: Replace with the following in Kotlin 1.7 and higher:
        //  matchResult.groups["number"]?.value ?: error("Regex group not found")
        "#${matchResult.groupValues[1]}"
    }

fun String.substringBetween(start: String, end: String) = substringAfter(start).substringBefore(end)
