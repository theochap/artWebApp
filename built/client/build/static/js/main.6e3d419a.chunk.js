(this.webpackJsonpclient = this.webpackJsonpclient || []).push([[0], { 45: function (e, t, a) { }, 73: function (e, t, a) { }, 74: function (e, t, a) {
            "use strict";
            a.r(t);
            var n = a(0), r = a.n(n), c = a(38), s = a.n(c), o = (a(45), a(12)), i = a(13), l = a(15), d = a(14), b = a(3), j = a(76), u = a(24), h = a.n(u), p = { "Content-Type": "application/json" }, O = "http://localhost:8080", x = function (e, t) { return h.a.post("".concat(O, "/user/login"), { email: e, password: t }, { headers: p }); }, g = function (e) { return h.a.post("".concat(O, "/user/signup"), e, { headers: p }); }, m = function () { return null !== localStorage.getItem("token"); }, f = function () { localStorage.clear(); }, v = a(1), w = function (e) { Object(l.a)(a, e); var t = Object(d.a)(a); function a() { var e; Object(o.a)(this, a); for (var n = arguments.length, r = new Array(n), c = 0; c < n; c++)
                r[c] = arguments[c]; return (e = t.call.apply(t, [this].concat(r))).disconnect = function () { f(), window.location = "/"; }, e; } return Object(i.a)(a, [{ key: "render", value: function () { return Object(v.jsxs)("div", { className: "Dashboard", children: [Object(v.jsx)("h1", { children: "Dashboard" }), Object(v.jsx)(j.a, { onClick: this.disconnect, block: !0, bsSize: "large", type: "submit", children: "Se d\xe9connecter" })] }); } }]), a; }(r.a.Component), k = a(16), C = a(18), y = a.n(C), S = a(20), I = a(75), z = a(78), A = a(77), N = function (e) { Object(l.a)(a, e); var t = Object(d.a)(a); function a() { var e; Object(o.a)(this, a); for (var n = arguments.length, r = new Array(n), c = 0; c < n; c++)
                r[c] = arguments[c]; return (e = t.call.apply(t, [this].concat(r))).state = { email: "", password: "" }, e.send = Object(S.a)(y.a.mark((function t() { var a, n, r, c, s; return y.a.wrap((function (t) { for (;;)
                switch (t.prev = t.next) {
                    case 0:
                        if (a = e.state, n = a.email, r = a.password, n && 0 !== n.length) {
                            t.next = 3;
                            break;
                        }
                        return t.abrupt("return");
                    case 3:
                        if (r && 0 !== r.length) {
                            t.next = 5;
                            break;
                        }
                        return t.abrupt("return");
                    case 5: return t.prev = 5, t.next = 8, x(n, r);
                    case 8:
                        c = t.sent, s = c.data, localStorage.setItem("token", s.token), window.location = "/dashboard", t.next = 17;
                        break;
                    case 14: t.prev = 14, t.t0 = t.catch(5), console.error(t.t0);
                    case 17:
                    case "end": return t.stop();
                } }), t, null, [[5, 14]]); }))), e.handleChange = function (t) { e.setState(Object(k.a)({}, t.target.id, t.target.value)); }, e; } return Object(i.a)(a, [{ key: "render", value: function () { var e = this.state, t = e.email, a = e.password; return Object(v.jsxs)("div", { className: "Login", children: [Object(v.jsxs)(I.a, { controlId: "email", bsSize: "large", children: [Object(v.jsx)(z.a, { children: "Email" }), Object(v.jsx)(A.a, { autoFocus: !0, type: "email", value: t, onChange: this.handleChange })] }), Object(v.jsxs)(I.a, { controlId: "password", bsSize: "large", children: [Object(v.jsx)(z.a, { children: "Password" }), Object(v.jsx)(A.a, { value: a, onChange: this.handleChange, type: "password" })] }), Object(v.jsx)(j.a, { onClick: this.send, block: !0, bsSize: "large", type: "submit", children: "Connexion" })] }); } }]), a; }(r.a.Component), E = function (e) { Object(l.a)(a, e); var t = Object(d.a)(a); function a() { var e; Object(o.a)(this, a); for (var n = arguments.length, r = new Array(n), c = 0; c < n; c++)
                r[c] = arguments[c]; return (e = t.call.apply(t, [this].concat(r))).state = { email: "", password: "", cpassword: "" }, e.send = Object(S.a)(y.a.mark((function t() { var a, n, r, c, s, o; return y.a.wrap((function (t) { for (;;)
                switch (t.prev = t.next) {
                    case 0:
                        if (a = e.state, n = a.email, r = a.password, c = a.cpassword, n && 0 !== n.length) {
                            t.next = 3;
                            break;
                        }
                        return t.abrupt("return");
                    case 3:
                        if (r && 0 !== r.length && r === c) {
                            t.next = 5;
                            break;
                        }
                        return t.abrupt("return");
                    case 5: return t.prev = 5, t.next = 8, g({ email: n, password: r });
                    case 8:
                        s = t.sent, o = s.data, localStorage.setItem("token", o.token), window.location = "/dashboard", t.next = 17;
                        break;
                    case 14: t.prev = 14, t.t0 = t.catch(5), console.error(t.t0);
                    case 17:
                    case "end": return t.stop();
                } }), t, null, [[5, 14]]); }))), e.handleChange = function (t) { e.setState(Object(k.a)({}, t.target.id, t.target.value)); }, e; } return Object(i.a)(a, [{ key: "render", value: function () { var e = this.state, t = e.email, a = e.password, n = e.cpassword; return Object(v.jsxs)("div", { className: "Login", children: [Object(v.jsxs)(I.a, { controlId: "email", bsSize: "large", children: [Object(v.jsx)(z.a, { children: "Email" }), Object(v.jsx)(A.a, { autoFocus: !0, type: "email", value: t, onChange: this.handleChange })] }), Object(v.jsxs)(I.a, { controlId: "password", bsSize: "large", children: [Object(v.jsx)(z.a, { children: "Password" }), Object(v.jsx)(A.a, { value: a, onChange: this.handleChange, type: "password" })] }), Object(v.jsxs)(I.a, { controlId: "cpassword", bsSize: "large", children: [Object(v.jsx)(z.a, { children: "Confirm Password" }), Object(v.jsx)(A.a, { value: n, onChange: this.handleChange, type: "password" })] }), Object(v.jsx)(j.a, { onClick: this.send, block: !0, bsSize: "large", type: "submit", children: "Inscription" })] }); } }]), a; }(r.a.Component), P = a(21), D = a(40), F = function (e) { var t = e.component, a = Object(D.a)(e, ["component"]); return Object(v.jsx)(b.b, Object(P.a)(Object(P.a)({}, a), {}, { render: function (e) { return !1 === m() ? Object(v.jsx)(b.a, { to: "/" }) : Object(v.jsx)(t, Object(P.a)({}, e)); } })); }, J = (a(73), function (e) { Object(l.a)(a, e); var t = Object(d.a)(a); function a() { return Object(o.a)(this, a), t.apply(this, arguments); } return Object(i.a)(a, [{ key: "render", value: function () { return Object(v.jsx)("div", { className: "App", children: Object(v.jsx)("div", { className: "App-content", children: Object(v.jsxs)(b.d, { children: [Object(v.jsx)(b.b, { exact: !0, path: "/", component: N }), Object(v.jsx)(b.b, { exact: !0, path: "/signup", component: E }), Object(v.jsx)(F, { path: "/dashboard", component: w })] }) }) }); } }]), a; }(n.Component)), L = a(19);
            s.a.render(Object(v.jsx)(L.a, { children: Object(v.jsx)(J, {}) }), document.getElementById("root"));
        } }, [[74, 1, 2]]]);
//# sourceMappingURL=main.6e3d419a.chunk.js.map
