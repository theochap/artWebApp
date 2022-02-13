import { Comments } from './lib.js';

export function PublicCommentsMiddleware(app) {
    app.get("/", Comments.get)
}

export function PrivateCommentsMiddleware(app) {
    app.post("/", Comments.add);
    app.delete("/", Comments.del);
    app.put("/", Comments.put);
}