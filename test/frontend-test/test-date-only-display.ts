import { describe, test } from "node:test";
import assert from "node:assert";

// Minimal Vue component harness: only the methods/computed of the mixin are
// needed, so the mixin itself is used directly as the "root" object.
import datetimeMixin from "../../src/mixins/datetime";

describe("datetime mixin date-only display", () => {
    const ctx = Object.assign({}, datetimeMixin.methods, {
        userTimezone: "UTC",
    });

    test("dateOnlyDisplay renders a readable date", () => {
        assert.strictEqual(ctx.dateOnlyDisplay("2026-11-22"), "Nov 22, 2026");
    });

    test("dateOnlyDisplay handles empty values", () => {
        assert.strictEqual(ctx.dateOnlyDisplay(""), "");
        assert.strictEqual(ctx.dateOnlyDisplay(undefined), "");
    });

    test("date method still returns the SQL date format", () => {
        assert.strictEqual(ctx.date("2026-11-22"), "2026-11-22");
    });
});
