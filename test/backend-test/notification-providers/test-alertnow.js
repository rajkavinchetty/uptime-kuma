const { describe, test, beforeEach, afterEach, mock } = require("node:test");
const assert = require("node:assert");
const axios = require("axios");

const AlertNow = require("../../../server/notification-providers/alertnow");
const { Settings } = require("../../../server/settings");
const { UP, DOWN } = require("../../../src/util");

describe("AlertNow notification provider", () => {
    let sent;

    beforeEach(() => {
        sent = [];
        mock.method(Settings, "get", async () => null);
        mock.method(axios, "post", async (url, data) => {
            sent.push(data);
            return { status: 200, data: "" };
        });
    });

    afterEach(() => mock.restoreAll());

    const notification = { alertNowWebhookURL: "https://alertnow.example.com/webhook" };
    const monitor = (id) => ({ id, name: `Monitor ${id}`, type: "http", url: "https://example.com" });
    const heartbeat = (status) => ({ status, msg: "msg", time: "2026-01-01 00:00:00.000" });

    test("send() uses the monitor name from monitorJSON and closes the alert on UP", async () => {
        const alertnow = new AlertNow();
        await alertnow.send(notification, "Monitor 1 [🔴 Down] Request failed with status code 500", monitor(1), heartbeat(DOWN));
        await alertnow.send(notification, "Monitor 1 [✅ Up] OK", monitor(1), heartbeat(UP));

        assert.deepStrictEqual(
            sent.map((data) => [data.summary, data.status, data.event_type]),
            [
                ["[Monitor 1] 🔴 Application went down - Monitor 1 [🔴 Down] Request failed with status code 500", "open", "ERROR"],
                ["[Monitor 1] ✅ Application is back online - Monitor 1 [✅ Up] OK", "close", "INFO"],
            ]
        );
        assert.match(sent[1].event_id, /_Monitor1$/);
    });
});
