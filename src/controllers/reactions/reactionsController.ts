import { SubRoutes } from '../../server.js';
import { Reactions } from './lib.js';

export function PublicReactionsMiddleware(app) {
    app.get("/", Reactions.GetAll)
    app.get(SubRoutes.reactions.comments, Reactions.GetComments)
    app.get(SubRoutes.reactions.emojis, Reactions.GetEmojis)

}

export function PrivateReactionsMiddleware(app) {
    app.post("/", Reactions.Add);
    app.delete("/", Reactions.Del);
    app.put("/", Reactions.Put);
}