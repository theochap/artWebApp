import { Comments } from './lib.js';

export function PublicReactionsMiddleware(app) {
    app.get("/", Comments.get)
}

export function PrivateReactionsMiddleware(app) {
    app.post("/", Comments.add);
    app.delete("/", Comments.del);
    app.put("/", Comments.put);
}