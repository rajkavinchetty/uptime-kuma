import { describe, test } from "node:test";
import assert from "node:assert";
import datetime from "../../src/mixins/datetime";

/**
 * Create a test instance of the datetime mixin
 * @param {string} timezone Timezone to use
 * @returns {object} Object with the mixin's methods bound to a timezone
 */
function mixin(timezone = "UTC") {
    return {
        userTimezone: timezone,
        ...datetime.methods,
        timezone,
    };
}

describe("date formatting", () => {
    test("formats date-only values in a readable form", () => {
        assert.strictEqual(mixin().dateReadable("2026-11-22"), "Nov 22, 2026");
    });

    test("formats date-time values that are date-only in a readable form", () => {
        assert.strictEqual(mixin().dateReadable("2026-11-22T00:00:00Z"), "Nov 22, 2026");
    });

    test("leaves values with a time part to be formatted as datetime", () => {
        assert.strictEqual(mixin().datetime("2026-11-22 13:45:00"), "2026-11-22 13:45:00");
    });

    test("date() keeps the YYYY-MM-DD format", () => {
        assert.strictEqual(mixin().date("2026-11-22"), "2026-11-22");
    });

    test("returns an empty string for empty values", () => {
        assert.strictEqual(mixin().dateReadable(""), "");
        assert.strictEqual(mixin().dateReadable(undefined), "");
    });
});
