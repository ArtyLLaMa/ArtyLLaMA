import{e as I,c as l,g as m,k as A,j as N,l as P,m as M,n as b,t as p,o as w}from"./_baseUniq-BbyDTv99.js";import{aM as g,aA as E,aN as F,aO as T,aP as _,aQ as o,aR as B,aS as S,aT as c,aU as R}from"./index-BJNGhUTg.js";var $=/\s/;function G(n){for(var r=n.length;r--&&$.test(n.charAt(r)););return r}var L=/^\s+/;function q(n){return n&&n.slice(0,G(n)+1).replace(L,"")}var x=NaN,z=/^[-+]0x[0-9a-f]+$/i,C=/^0b[01]+$/i,H=/^0o[0-7]+$/i,K=parseInt;function Q(n){if(typeof n=="number")return n;if(I(n))return x;if(g(n)){var r=typeof n.valueOf=="function"?n.valueOf():n;n=g(r)?r+"":r}if(typeof n!="string")return n===0?n:+n;n=q(n);var t=C.test(n);return t||H.test(n)?K(n.slice(2),t?2:8):z.test(n)?x:+n}var v=1/0,U=17976931348623157e292;function W(n){if(!n)return n===0?n:0;if(n=Q(n),n===v||n===-v){var r=n<0?-1:1;return r*U}return n===n?n:0}function X(n){var r=W(n),t=r%1;return r===r?t?r-t:r:0}function tn(n){var r=n==null?0:n.length;return r?l(n):[]}var O=Object.prototype,Y=O.hasOwnProperty,an=E(function(n,r){n=Object(n);var t=-1,e=r.length,i=e>2?r[2]:void 0;for(i&&F(r[0],r[1],i)&&(e=1);++t<e;)for(var f=r[t],a=T(f),s=-1,d=a.length;++s<d;){var u=a[s],h=n[u];(h===void 0||_(h,O[u])&&!Y.call(n,u))&&(n[u]=f[u])}return n});function en(n){var r=n==null?0:n.length;return r?n[r-1]:void 0}function y(n){return function(r,t,e){var i=Object(r);if(!o(r)){var f=m(t);r=A(r),t=function(s){return f(i[s],s,i)}}var a=n(r,t,e);return a>-1?i[f?r[a]:a]:void 0}}var D=Math.max;function J(n,r,t){var e=n==null?0:n.length;if(!e)return-1;var i=t==null?0:X(t);return i<0&&(i=D(e+i,0)),N(n,m(r),i)}var sn=y(J);function Z(n,r){var t=-1,e=o(n)?Array(n.length):[];return P(n,function(i,f,a){e[++t]=r(i,f,a)}),e}function fn(n,r){var t=B(n)?M:Z;return t(n,m(r))}function V(n,r){return n<r}function k(n,r,t){for(var e=-1,i=n.length;++e<i;){var f=n[e],a=r(f);if(a!=null&&(s===void 0?a===a&&!I(a):t(a,s)))var s=a,d=f}return d}function dn(n){return n&&n.length?k(n,S,V):void 0}function j(n,r,t,e){if(!g(n))return n;r=b(r,n);for(var i=-1,f=r.length,a=f-1,s=n;s!=null&&++i<f;){var d=p(r[i]),u=t;if(d==="__proto__"||d==="constructor"||d==="prototype")return n;if(i!=a){var h=s[d];u=void 0,u===void 0&&(u=g(h)?h:c(r[i+1])?[]:{})}R(s,d,u),s=s[d]}return n}function un(n,r,t){for(var e=-1,i=r.length,f={};++e<i;){var a=r[e],s=w(n,a);t(s,a)&&j(f,b(a,n),s)}return f}export{V as a,k as b,Z as c,un as d,dn as e,tn as f,sn as g,an as h,X as i,en as l,fn as m,W as t};
