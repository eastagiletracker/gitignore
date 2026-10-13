/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import fs from "fs";
import { GET } from "../../../app/api/result/route";

const request = (query: string) =>
  new NextRequest(`http://localhost/api/result${query}`);

describe("GET /api/result", () => {
  test("returns 400 when options are missing", async () => {
    const response = await GET(request(""));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "No query parameters provided",
    });
  });

  test("returns 400 when options are empty", async () => {
    const response = await GET(request("?options=,,"));

    expect(response.status).toBe(400);
  });

  test("ignores a trailing comma and unknown options", async () => {
    const response = await GET(request("?options=c,c%2B%2B,notatech,"));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(
      fs.readFileSync("./tests/assets/C_C++.gitignore", "utf8"),
    );
  });
});
