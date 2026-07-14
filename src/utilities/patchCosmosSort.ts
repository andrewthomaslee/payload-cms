import mongoose from "mongoose"

type SortDirection = 1 | -1 | "asc" | "desc" | "ascending" | "descending"

type SortArg =
  | string
  | Array<[string, SortDirection]>
  | Record<string, SortDirection>

let patched = false

const normalizeSort = (sort: unknown): unknown => {
  if (typeof sort === "string") {
    const fields = sort.split(/\s+/).filter(Boolean)
    const withoutIdTieBreaker = fields.filter((field) => field !== "_id" && field !== "-_id")

    return withoutIdTieBreaker.length > 0 ? withoutIdTieBreaker.join(" ") : sort
  }

  if (Array.isArray(sort)) {
    const withoutIdTieBreaker = sort.filter(([field]) => field !== "_id")

    return withoutIdTieBreaker.length > 0 ? withoutIdTieBreaker : sort
  }

  if (sort && typeof sort === "object" && "_id" in sort && Object.keys(sort).length > 1) {
    const { _id: _ignored, ...rest } = sort as Record<string, SortDirection>

    return rest
  }

  return sort
}

export const patchCosmosSort = (): void => {
  if (patched || process.env.PAYLOAD_COSMOS_SORT_PATCH === "false") return

  patched = true

  const Query = mongoose.Query
  const originalSort = Query.prototype.sort as (...args: unknown[]) => unknown

  Query.prototype.sort = function patchedSort(this: unknown, sort?: SortArg, ...args: unknown[]) {
    return originalSort.call(this, normalizeSort(sort), ...args)
  } as typeof Query.prototype.sort
}
